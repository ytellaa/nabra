/**
 * Retour Android : une fenêtre ouverte (fiche du mot) peut intercepter le bouton retour
 * pour se fermer au lieu de quitter l'écran.
 */
let handler: (() => void) | null = null;

export function setBackHandler(h: (() => void) | null) {
  handler = h;
}

/** Appelé par le bouton retour : true si une fenêtre l'a consommé. */
export function consumeBack(): boolean {
  if (!handler) return false;
  handler();
  return true;
}
