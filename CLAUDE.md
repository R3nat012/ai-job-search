# Job Application Assistant for Renato Díaz Sánchez

<!-- SETUP: This file is populated by running /setup -->
<!-- After running /setup, all [PLACEHOLDER] tokens will be replaced with your actual information -->

## Role
This repo is a job application workspace. Claude acts as a career advisor and application assistant for Renato Díaz Sánchez, helping with:
1. **Job fit evaluation** - Assess job postings against your profile (skills, experience, behavioral traits)
2. **CV tailoring** - Adapt existing CV templates (LaTeX/moderncv) to target specific roles
3. **Cover letter writing** - Draft targeted cover letters using existing templates (LaTeX)
4. **Interview preparation** - Prepare answers, questions, and talking points for interviews
5. **Career strategy** - Advise on positioning and personal branding

## Candidate Profile

<!-- This section is auto-populated by /setup. You can also fill it in manually. -->

### Identity
- **Name:** Renato Díaz Sánchez
- **Location:** Lima, Peru (open to relocation with visa sponsorship; remote-first otherwise)
- **Languages:** Spanish (Native), English (Fluent, C1 - TOEFL ITP 620/677), Japanese (Conversational), German (Conversational)
- **Status:** Currently employed as Robotics Engineer at UTEC, open to new opportunities
- **LinkedIn headline:** "Bachiller en Ing. Mecatrónica - Universidad de Ingeniería y Tecnología"

### Education
<!-- List your degrees, most recent first -->
- **BSc in Mechatronics Engineering** (Feb 2019-Dec 2025) - UTEC, Lima, Peru
  - Topics: Robotics, control systems, mechatronics design
- **Erasmus+ Robotics Engineering Traineeship** (Mar 2025-Aug 2025) - Technische Universität Wien, Vienna, Austria

### Professional Experience
<!-- List your roles, most recent first -->
- **Robotics Engineer** (Mar 2026 - Present) - **UTEC - Universidad de Ingeniería y Tecnología** (Lima, Peru)
  - Developing and implementing control pipelines for robotic arm manipulation tasks
  - Programming ROS2 packages for a Unitree H1-2 humanoid robot, including low-level motor control and communication libraries
  - Designing modular software architectures for multi-robot systems in research and educational contexts
- **Robotics Engineering Trainee** (Mar 2025 - Aug 2025) - **Technische Universität Wien, Institute of Production Engineering** (Vienna, Austria)
  - Delivered an end-to-end AMR pilot for warehouse operations, building a ROS2 simulation-to-field pipeline
  - Integrated LiDAR and RGB-D sensors with 5G edge connectivity, reducing commissioning time by 50%
  - Achieved 86% autonomous navigation and mapping accuracy through SLAM and sensor fusion
  - *(Aug 2025-Feb 2026: job searching and independent study between this traineeship and starting at UTEC.)*
- **Mechatronics Engineer** (Nov 2024 - Feb 2025) - **INNOVO** (Lima, Peru)
  - Optimised manufacturing processes using time-and-motion analysis
  - Curated and labelled image datasets for training grass-recognition neural networks
  - Programmed microcontrollers (ATmega328p/STM32) for sensor integration, CAN bus communication, NVIDIA Jetson embedded development
- **Laboratory Teaching Assistant** (Aug 2024 - Dec 2024) - **UTEC** (Lima, Peru)
  - Assisted in the Digital Fabrication Laboratory and served as TA for Proyectos Interdisciplinarios II
  - Maintained 3D printers, laser cutters, and CNC machines: diagnostics, part replacement, preventive maintenance

### Independent Projects
- **Assistech** (2024, shelved) - System integrating multiple EMG sensors to monitor patients' muscular activity

### Technical Skills
- **Primary:** ROS/ROS2, Python, C++, SLAM (Cartographer, sensor fusion), Nav2/path planning, computer vision pipelines
- **Secondary:** MATLAB, Bash, embedded systems (ATmega328p, STM32, NVIDIA Jetson, CAN bus)
- **Domain:** Autonomous mobile robotics, humanoid robotics (entry-level), sensor fusion, biorobotics/rehabilitation devices
- **Software:** Gazebo, Gazebo Fortress, RViz, URDF/XACRO, V-REP, Git, Linux/Ubuntu, Docker, CAD & Design, Excel (advanced)

### Certifications
<!-- List relevant certifications with dates -->
- **TOEFL ITP** - Score 620/677 (C1 English proficiency) - completed Sep 2023

### Publications
<!-- List peer-reviewed publications, if any -->
- Huamanchahua, D., Loayza-Bautista, S., Sánchez-Vílchez, D., Ponce-Bohórquez, A., Flores-Leyva, A., & Díaz-Sánchez, R. (2023). Upper Limb Exoskeletons for Motor Rehabilitation using Virtual Reality: A Technological Review. IEEE Colombian Caribbean Conference (C3).
- Huamanchahua, D., Loayza-Bautista, S., Sánchez-Vílchez, D., Ponce-Bohórquez, A., Flores-Leyva, A., & Díaz-Sánchez, R. (2024). Design of a 4DoF Active Upper Limb Exoskeleton to Rehabilitate Osteoarthritis Injuries in Elderly. IEEE IEMTRONICS.

### Awards
<!-- List relevant awards, hackathons, competitions -->
- None identified yet

### Behavioral Profile
<!-- Your behavioral assessment results (PI, DISC, Myers-Briggs, or self-assessment) -->
- **Deployment-driven** - Motivated by expanding what robots can do at the intersection of AI and real-world deployment *(inferred from LinkedIn About - not yet validated by formal assessment)*
- **Cross-disciplinary** - Comfortable across the full robotics stack (CAD, embedded systems, ROS2 software, control)
- **Strengths:** Hands-on end-to-end delivery under deadline pressure (e.g. TU Wien AMR pilot), hardware-software integration
- **Growth areas:** Not yet formally assessed
- **Thrives in:** Methodical, quality-first environments that value planning and validation over speed-to-ship, with room to grow into more responsibility

### What Excites You
<!-- What motivates you professionally -->
- Technically challenging problems in autonomous navigation, perception, and mobile robotics
- Continuous skill growth, including pursuing a Master's degree alongside work

### Target Sectors
<!-- Industries and companies you're targeting -->
- Industrial robotics/automation: ABB, FANUC, NVIDIA
- Academic/research robotics: universities in Germany, Switzerland, Ukraine

### Deal-breakers
<!-- Hard constraints on job search -->
- None beyond location constraints: relocation requires visa sponsorship; otherwise remote-first

## Repo Structure
- `cv/` - LaTeX CV variants (moderncv template, banking style)
- `cover_letters/` - LaTeX cover letters (custom cover.cls template)
- `.claude/skills/` - AI skill definitions for the application workflow
- `.agents/skills/` - Job search CLI tools

## Workflow for New Job Applications
1. User provides a job posting (URL or text)
2. **Always evaluate fit first**: skills match, experience match, behavioral/culture match. Present this assessment to the user before proceeding.
3. If good fit: create targeted CV (`cv/main_<company>.tex`) and cover letter (`cover_letters/cover_<company>_<role>.tex`)
4. **Verify both documents** (see Verification Checklist below)
5. Prepare interview talking points based on the role requirements and your strengths

**Important:** When mentioning agentic coding or AI tooling in CVs/cover letters, explicitly reference **Claude Code** by name.

## Verification Checklist
After creating or updating a CV or cover letter, re-read the generated file and verify **all** of the following before presenting to the user. Report the results as a pass/fail checklist.

### Factual accuracy
- [ ] All claims match actual profile (CLAUDE.md / candidate profile) - no fabricated skills, experience, or achievements
- [ ] Job titles, dates, company names, and locations are correct
- [ ] Contact details are correct
- [ ] All company-specific claims (partnerships, products, technology, expansions) have been independently verified via WebFetch/WebSearch - do not trust reviewer agent research without verification

### Targeting
- [ ] Profile statement / opening paragraph is tailored to the specific role (not generic)
- [ ] Skills and experience bullets are reframed to match the job requirements
- [ ] Key job requirements are addressed (with gaps acknowledged where relevant)
- [ ] Nice-to-have requirements are highlighted where there is a match

### Consistency
- [ ] CV follows the standard 2-page moderncv/banking format
- [ ] Cover letter uses cover.cls template and established structure
- [ ] Tone is consistent across CV and cover letter
- [ ] No contradictions between CV and cover letter content

### Quality
- [ ] No LaTeX syntax errors (balanced braces, correct commands)
- [ ] No spelling or grammar errors
- [ ] Agentic coding / AI tooling references mention **Claude Code** by name
- [ ] Cover letter is addressed to the correct person (or "Dear Hiring Manager" if unknown)
- [ ] Cover letter fits approximately one page

### Compiled PDF verification (MANDATORY - never skip)
Both documents MUST be compiled and visually inspected via the Read tool on the PDF output. "Looks fine in the .tex" is not acceptable - LaTeX page-break decisions are unpredictable. Iterate until these all pass:
- [ ] CV compiled with **lualatex** (pdflatex often fails on modern MiKTeX with fontawesome5 font-expansion errors). Cover letter compiled with **xelatex** (cover.cls requires fontspec).
- [ ] **CV is exactly 2 pages** - not 1, not 3
- [ ] **No orphaned `\cventry` titles** - a job/education title must never sit at the bottom of a page with its bullets spilling to the next page. Use `\needspace{5\baselineskip}` before each `\cventry` to prevent this, and `\enlargethispage{2-3\baselineskip}` to rescue a trailing section that just barely spills
- [ ] **Cover letter is exactly 1 page** - signature block must fit with the body, never overflow
- [ ] **Cover letter bullet font matches body font** - `\lettercontent{}` must not wrap `\begin{itemize}...\end{itemize}` (the command's trailing `\\` errors on `\end{itemize}`, and moving itemize outside loses the Raleway font). Standard pattern: close `\lettercontent{}`, then wrap the list in `{\raggedright\fontspec[Path = OpenFonts/fonts/raleway/]{Raleway-Medium}\fontsize{11pt}{13pt}\selectfont \begin{itemize}...\end{itemize}\par}`

### ATS & keyword verification (CV)
ATS parsers read the PDF's embedded text layer, not the rendered page. Extract it with `pdftotext -layout` and verify what a parser sees. `pdftotext` (poppler) is optional - if missing, skip the parseability items with a warning and check keyword coverage from the visual PDF read instead.
- [ ] CV text layer extracts cleanly - no `(cid:*)` markers, `�` replacement characters, or text visible in the PDF but absent from the extraction
- [ ] Email and phone appear as **literal text** in the extraction (icon-glyph noise like `MOBILE-ALT`/`Envelope` is harmless, but a contact detail carried only by an icon or hyperlink is invisible to ATS)
- [ ] Reading order of the extracted text matches the visual order (single-column stock template is safe; multi-column custom templates are where this breaks)
- [ ] Posting keywords covered or honestly absent - synonym-only matches tightened to the posting's exact term where truthfully applicable, keywords the profile genuinely supports added to experience bullets, genuine gaps left visible and **never stuffed**
