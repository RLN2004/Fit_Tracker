# Fit Tracker

Offline-first home strength tracker for the current beginner plan.

## Local Termux

```bash
cd ~/home_strength_tracker
python -m http.server 8080 --bind 127.0.0.1
```

Open `http://127.0.0.1:8080`.

Workout schedule:
- Monday: Upper A
- Tuesday: Lower A + Core
- Wednesday: Walking / Cardio
- Thursday: Upper B
- Friday: Lower B + Core
- Saturday: Walking / Cardio
- Sunday: Rest

Workout data is stored in browser localStorage. Use **Progress → Export JSON backup** regularly.

Do not train through dizziness or near-fainting.
