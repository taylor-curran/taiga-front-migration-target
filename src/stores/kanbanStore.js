import { create } from 'zustand';
import _ from 'lodash';

const useKanbanStore = create((set, get) => ({
  usByStatus: new Map(),
  usMap: new Map(),
  usByStatusSwimlanes: new Map(),
  swimlanesList: [],
  
  userstoriesRaw: [],
  swimlanes: [],
  usersById: {},
  project: null,
  order: {},
  foldStatusChanged: {},
  archivedStatus: [],
  statusHide: [],

  reset: (resetSwimlanesList = true, resetArchivedStatus = true, resetHideStatus = true) => {
    set((state) => ({
      userstoriesRaw: [],
      swimlanes: [],
      foldStatusChanged: {},
      usByStatus: new Map(),
      usMap: new Map(),
      usByStatusSwimlanes: new Map(),
      statusHide: resetHideStatus ? [] : state.statusHide,
      archivedStatus: resetArchivedStatus ? [] : state.archivedStatus,
      swimlanesList: resetSwimlanesList ? [] : state.swimlanesList,
    }));
  },

  init: (project, swimlanes, usersById) => {
    set({ project, swimlanes, usersById });
  },

  set: (userstories) => {
    set({ userstoriesRaw: userstories });
    get().refreshRawOrder();
    get().refresh();
  },

  add: (usList) => {
    const state = get();
    if (!Array.isArray(usList)) {
      usList = [usList];
    }

    usList = _.sortBy(usList, ['kanban_order']);

    const filteredRaw = state.userstoriesRaw.filter(us => 
      !usList.find(newUs => newUs.id === us.id)
    );
    const newRaw = [...filteredRaw, ...usList];

    set({ userstoriesRaw: newRaw });
    get().refreshRawOrder();

    const sortedRaw = _.sortBy(newRaw, [us => state.order[us.id]]);
    set({ userstoriesRaw: sortedRaw });

    const newUsByStatus = new Map(state.usByStatus);
    const newUsMap = new Map(state.usMap);

    usList.forEach(usModel => {
      const us = get().retrieveUserStoryData(usModel);
      const status = String(usModel.status);

      if (!newUsByStatus.has(status)) {
        newUsByStatus.set(status, []);
      }

      if (!newUsMap.has(usModel.id)) {
        newUsMap.set(usModel.id, us);
        
        const statusList = newUsByStatus.get(status).filter(id => id !== usModel.id);
        statusList.push(usModel.id);
        newUsByStatus.set(status, statusList);
      }
    });

    set({ usByStatus: newUsByStatus, usMap: newUsMap });
    get().refreshSwimlanes();
  },

  remove: (usModel) => {
    const state = get();
    const newRaw = state.userstoriesRaw.filter(us => us.id !== usModel.id);
    const newOrder = { ...state.order };
    delete newOrder[usModel.id];

    const status = String(usModel.status);
    const newUsMap = new Map(state.usMap);
    newUsMap.delete(usModel.id);

    const newUsByStatus = new Map(state.usByStatus);
    if (newUsByStatus.has(status)) {
      const statusList = newUsByStatus.get(status).filter(id => id !== usModel.id);
      newUsByStatus.set(status, statusList);
    }

    set({ 
      userstoriesRaw: newRaw, 
      order: newOrder, 
      usMap: newUsMap, 
      usByStatus: newUsByStatus 
    });
    get().refreshSwimlanes();
  },

  refreshRawOrder: () => {
    const state = get();
    const newOrder = {};
    if (state.userstoriesRaw) {
      state.userstoriesRaw.forEach(us => {
        newOrder[us.id] = us.kanban_order;
      });
    }
    set({ order: newOrder });
  },

  retrieveUserStoryData: (usModel) => {
    const state = get();
    const us = {};
    
    const model = usModel;
    
    us.foldStatusChanged = state.foldStatusChanged[usModel.id];
    us.model = model;
    us.images = _.filter(model.attachments || [], attachment => !!attachment.thumbnail_card_url);
    
    us.id = usModel.id;
    us.swimlane = usModel.swimlane;
    us.assigned_to = state.usersById[usModel.assigned_to];
    us.assigned_users = [];

    if (usModel.assigned_users) {
      usModel.assigned_users.forEach(assignedUserId => {
        const assignedUserData = state.usersById[assignedUserId];
        if (assignedUserData) {
          us.assigned_users.push(assignedUserData);
        }
      });
    }

    us.assigned_users_preview = us.assigned_users.slice(0, 3);

    us.colorized_tags = _.map(us.model.tags || [], tag => ({
      name: tag[0],
      color: tag[1]
    }));

    return us;
  },

  refresh: (refreshUsMap = true, refreshSwimlanes = true) => {
    const state = get();
    const sortedRaw = _.sortBy(state.userstoriesRaw, [us => state.order[us.id]]);
    
    const collection = {};
    const newUsMap = new Map(state.usMap);

    sortedRaw.forEach(usModel => {
      const us = get().retrieveUserStoryData(usModel);
      const status = String(usModel.status);
      
      if (!collection[status]) {
        collection[status] = [];
      }

      collection[status] = collection[status].filter(id => id !== usModel.id);
      collection[status].push(usModel.id);

      if (refreshUsMap) {
        newUsMap.set(usModel.id, us);
      }
    });

    const newUsByStatus = new Map();
    Object.entries(collection).forEach(([status, ids]) => {
      newUsByStatus.set(status, ids);
    });

    set({ 
      userstoriesRaw: sortedRaw, 
      usByStatus: newUsByStatus,
      usMap: refreshUsMap ? newUsMap : state.usMap
    });

    if (refreshSwimlanes) {
      get().refreshSwimlanes();
    }
  },

  refreshSwimlanes: () => {
    const state = get();
    if (!state.swimlanes || !state.swimlanes.length) {
      return;
    }

    let newSwimlanesList = [...state.swimlanes];
    const newUsByStatusSwimlanes = new Map();

    const userstoriesNoSwimlane = state.userstoriesRaw.filter(us => us.swimlane == null);
    const emptySwimlaneExists = newSwimlanesList.some(swimlane => swimlane.id == null);

    if (userstoriesNoSwimlane.length && !emptySwimlaneExists) {
      const emptySwimlane = {
        id: -1,
        kanban_order: 1,
        name: "Unclassified User Stories"
      };
      newSwimlanesList.unshift(emptySwimlane);
    }

    newSwimlanesList.forEach(swimlane => {
      const swimlaneUsByStatus = new Map();
      
      state.usByStatus.forEach((usList, statusId) => {
        const usListSwimlanes = usList.filter(usId => {
          const us = state.usMap.get(usId);
          const swimlaneId = swimlane.id === -1 ? null : swimlane.id;
          return us?.model?.swimlane === swimlaneId;
        });
        
        swimlaneUsByStatus.set(Number(statusId), usListSwimlanes);
      });

      newUsByStatusSwimlanes.set(swimlane.id, swimlaneUsByStatus);
    });

    set({ 
      swimlanesList: newSwimlanesList, 
      usByStatusSwimlanes: newUsByStatusSwimlanes 
    });
  },

  getUs: (id) => get().usMap.get(id),
  getUsModel: (id) => _.find(get().userstoriesRaw, us => us.id === id),
  
  toggleFold: (usId) => {
    const state = get();
    const newFoldStatus = { ...state.foldStatusChanged };
    newFoldStatus[usId] = !newFoldStatus[usId];
    set({ foldStatusChanged: newFoldStatus });
    get().refreshUserStory(usId);
  },

  refreshUserStory: (usId) => {
    const state = get();
    const usModel = get().getUsModel(usId);
    if (usModel) {
      const us = get().retrieveUserStoryData(usModel);
      const newUsMap = new Map(state.usMap);
      newUsMap.set(usId, us);
      set({ usMap: newUsMap });
    }
  },
}));

export default useKanbanStore;
