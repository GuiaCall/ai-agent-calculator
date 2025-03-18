
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

export const fr = {
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
    disclaimerText: "Veuillez noter que tous les calculs fournis sont des approximations. Les coûts réels peuvent varier en fonction des modèles d'utilisation spécifiques, des changements de prix des fournisseurs et d'autres facteurs.",
    disclaimerAccept: "Je comprends que ce sont des calculs approximatifs",
    
    // Additional translation keys
    technologies: "Technologies",
    
    // Technology section messages
    noTechnologySelected: "Aucune Stack Technologique Sélectionnée",
    selectTechnologyMessage: "Veuillez sélectionner au moins une Stack Technologique."
  }
};
