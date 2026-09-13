import iconSprite from '../assets/icons/system-icons.svg';

const iconIds = new Set([
  'calendar','photos','mail','messages','safari','music','notes','files','settings','appstore',
  'weather','clock','calculator','camera','contacts','maps','reminders','freeform','home','shortcuts',
  'findmy','facetime','books','podcasts','tv','tips','voice'
]);

function IconGraphic({ appId }) {
  const symbolId = iconIds.has(appId) ? appId : 'files';
  return (
    <svg className="app-icon-svg" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <use href={`${iconSprite}#${symbolId}`} />
    </svg>
  );
}

export default function AppIcon({ app, onOpen, size = 'normal', disabled = false }) {
  const handleOpen = () => { if (!disabled) onOpen(app); };
  return (
    <button className={`app-icon app-icon-${size}`} onClick={handleOpen} disabled={disabled} aria-label={`Abrir ${app.name}`} title={app.name}>
      <span className="icon-art" aria-hidden="true">
        <IconGraphic appId={app.id} />
        {app.badge > 0 && <span className="app-icon-notification">{app.badge > 99 ? '99+' : app.badge}</span>}
      </span>
      <span className="app-icon-name">{app.name}</span>
    </button>
  );
}
