const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req?.user?.role) return res.sendStatus(401); // Unauthorized

    const rolesArray = [...allowedRoles];
    console.log(rolesArray);
    console.log(req?.user?.role);

    const result = rolesArray.includes(req.user.role);
    if (!result) return res.sendStatus(401);
    next();
  };
};

module.exports = verifyRoles;
