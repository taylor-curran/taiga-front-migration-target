import { useState, useEffect } from 'react';
import { fetchLocales } from '../../services/api';

const LanguageSelector = () => {
  const [locales, setLocales] = useState([]);
  const [currentLang, setCurrentLang] = useState(
    localStorage.getItem('lang') || 'en'
  );

  useEffect(() => {
    const loadLocales = async () => {
      const data = await fetchLocales();
      setLocales(data);
    };
    loadLocales();
  }, []);

  const handleLanguageChange = (lang) => {
    localStorage.setItem('lang', lang);
    setCurrentLang(lang);
    window.location.reload();
  };

  return (
    <div className="language-selector">
      <select 
        value={currentLang} 
        onChange={(e) => handleLanguageChange(e.target.value)}
        className="language-select"
      >
        {locales.map((locale) => (
          <option key={locale.code} value={locale.code}>
            {locale.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;
