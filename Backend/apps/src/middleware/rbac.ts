export const RBAC_PERMISSIONS = {
  DG: { canAccessForms: false, canSubmitForms: false, canEditForms: false, canDeleteForms: false, canViewForms: true },
  COMMISSAIRE: { canAccessForms: false, canSubmitForms: false, canEditForms: false, canDeleteForms: false, canViewForms: false },
  OFFICIER: { canAccessForms: true, canSubmitForms: true, canEditForms: true, canDeleteForms: false, canViewForms: true },
  SUPER_ADMIN: { canAccessForms: true, canSubmitForms: true, canEditForms: true, canDeleteForms: true, canViewForms: true }
};

export const requireFormAccess = (req, res, next) => {
  const userRole = req.user?.role;
  
  if (!RBAC_PERMISSIONS[userRole]?.canAccessForms) {
    return res.status(403).json({
      error: 'Accès aux formulaires restreint. Seuls les Officiers et Super Administrateurs peuvent accéder à cette ressource.',
      code: 'FORMS_ACCESS_DENIED'
    });
  }
  
  next();
};
