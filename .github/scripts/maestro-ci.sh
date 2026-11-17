#!/usr/bin/env bash
# Joue les scénarios Maestro sur l'émulateur, avec une relance en cas d'échec.
# Usage : maestro-ci.sh <dossier des scénarios>
#
# Juste après un démarrage à froid, l'émulateur est instable : une appli système plante
# (« Messenger has stopped » sur API 24) ou les services Google Play redémarrent et Android
# ferme Nabra au passage (API 34). Ces incidents ne viennent pas de Nabra : on ferme les
# fenêtres système, puis on relance une fois les scénarios si le premier passage échoue.
set -u
flows="$1"

run() {
  # Ferme les fenêtres système (« … has stopped ») qui recouvriraient l'application
  adb shell am broadcast -a android.intent.action.CLOSE_SYSTEM_DIALOGS > /dev/null 2>&1 || true
  maestro test "$flows" --format junit --output maestro-report.xml --test-output-dir maestro-output
}

# Laisse le système finir de démarrer ses services avant le premier passage
sleep 30

if run; then
  exit 0
fi

echo "⚠️ Premier passage en échec : relance après 30 s (instabilité de l'émulateur possible)." | tee -a "$GITHUB_STEP_SUMMARY"
sleep 30
run
