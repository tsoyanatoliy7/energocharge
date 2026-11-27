/* ES module entry: mounts the three.js twin of the station (js/station3d.js). */
import { createStation3D } from './station3d.js';
  const ins = document.getElementById('ins');
  const stage = ins.querySelector('.ins__stage'), face = ins.querySelector('.face--front');
  const ctl = createStation3D(stage, face, { onFrame: ({ bx, by }) => { stage.style.setProperty('--pbx', bx + 'px'); stage.style.setProperty('--pby', by + 'px'); } });
  if (ctl) {
    ins.classList.add('has3d');
    const sync = (e) => { const d = e ? e.detail : { part: ins.dataset.part, tag: '' }; ctl.show(d.part === 'stop'); ctl.setPhase(d.part === 'stop' ? d.tag : ''); };
    addEventListener('ins:phase', sync); sync();
  }
