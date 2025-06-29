import countries from "i18n-iso-countries";
import cs from "i18n-iso-countries/langs/cs.json";
// Import all supported locales here
import en from "i18n-iso-countries/langs/en.json";

countries.registerLocale(en);
countries.registerLocale(cs);

export default countries;
