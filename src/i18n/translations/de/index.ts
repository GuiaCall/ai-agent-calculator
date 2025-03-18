
import { agency } from './agency';
import { auth } from './auth';
import { calculator } from './calculator';
import { client } from './client';
import { dashboard } from './dashboard';
import { general } from './general';
import { invoice } from './invoice';
import { legal } from './legal';
import { technologies } from './technologies';
import { ui } from './ui';

export const de = {
  translation: {
    ...auth,
    ...general,
    ...ui,
    ...agency,
    ...client,
    ...calculator,
    ...invoice,
    ...dashboard,
    ...legal,
    ...technologies,
    
    // Disclaimer translations
    disclaimerText: "Bitte beachten Sie, dass alle bereitgestellten Berechnungen Näherungswerte sind. Die tatsächlichen Kosten können je nach spezifischen Nutzungsmustern, Preisänderungen der Anbieter und anderen Faktoren variieren.",
    disclaimerAccept: "Ich verstehe, dass dies ungefähre Berechnungen sind",
    
    // Additional translation keys
    technologies: "Technologien",
    
    // Technology section messages
    noTechnologySelected: "Kein Technologie-Stack ausgewählt",
    selectTechnologyMessage: "Bitte wählen Sie mindestens einen Technologie-Stack aus."
  }
};
