# documents/ — contents and notes

This folder is organized to match the ai-job-search repo's expected layout for `/setup` Path A. Drop the whole `documents/` folder into the root of your fork.

## cv/
- `RENATO_DIAZ_SANCHEZ_CV.pdf` — your original source CV (plain format)
- `main_example_compiled_preview.pdf` — visual preview of the LaTeX moderncv version already built for you; the `.tex` source itself goes in `cv/main_example.tex` at the repo root, not here

## diplomas/
- `UTEC_Constancia_de_Egresado.pdf` — UTEC graduation certificate
- `TOEFL_ITP_Certificate.pdf` — English proficiency certification (cited in your Roche letter as C1)
- `TU_Wien_ERASMUS_Acceptance_Letter.pdf` — official acceptance letter for the ERASMUS+ traineeship, confirms dates and duties

## publications/
- `IEEE_IEMTRONICS_2024_Upper_Limb_Exoskeleton.pdf`
- `IEEE_C3_2023_Upper_Limb_VR_Review.pdf`

These are your two IEEE papers as listed on your CV.

## applications/
- `Roche_FieldServiceEngineeringSupport/cover_letter.pdf` — your existing cover letter for a Field Service Engineering Support role at Roche. Note: this role is medical-instrument maintenance-adjacent, not core robotics engineering — useful as a style sample but not representative of your primary target roles.
- `iKnowHow_AssociateRoboticsSoftwareEngineer/cover_letter.txt` — reconstructed from a past session; ROS2/Nav2/AMR-focused, targeted at a robotics software role in Athens
- `THEKER_SoftwareRoboticsEngineer/application_answers.txt` — reconstructed from a past session; short-answer format (not a traditional letter) for a robotics engineer role in Barcelona

## What was intentionally left out

- **`certificat.pdf` from your original zip was NOT included.** It's an Erasmus+ Certificate of Attendance issued to a different person (Meryem Didar Bayrakçil, Sivas Cumhuriyet University) — it appears to have been included in the zip by mistake. Worth checking your files for the version that's actually yours.
- **The 1008-page IEEE C3 2023 proceedings PDF was NOT included** — that's the full conference proceedings book, not your individual paper. Your actual paper is already included above as `IEEE_C3_2023_Upper_Limb_VR_Review.pdf`.
- **`coverletter_ag.pdf` (an acoustic-sensing inspection robot paper) was NOT included.** Despite the filename, it's not a cover letter — it's a paper whose visible author list (Andrade, Chapoñana, Ortiz, Saavedra) doesn't include you, and it isn't one of the two IEEE publications listed on your CV. If you're actually a co-author on it, add it back manually and update `01-candidate-profile.md` accordingly — but I didn't want to attribute it to you without confirmation, since the framework's rule is that every claim in your materials has to be verifiable.

## references/ and linkedin/

Empty for now — add a LinkedIn PDF export to `linkedin/` and any reference letters to `references/` if you have them; `/setup` and `/expand` will pick them up automatically.
