import { AdminIcon } from './AdminIcon';

export function AdminLogo() {
  return (
    <span className="zp-admin-logo">
      <AdminIcon />
      <span className="zp-admin-logo__copy">
        <strong>Zhupi CMS</strong>
        <small>Personal workspace</small>
      </span>
    </span>
  );
}
