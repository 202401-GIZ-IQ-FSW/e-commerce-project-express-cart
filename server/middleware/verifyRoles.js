const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req?.user?.role) return res.sendStatus(401); // Unauthorized

    const rolesArray = [...allowedRoles];
    console.log(rolesArray);
    console.log(req?.role);

    const result = rolesArray.includes(req.role);
    if (!result) return res.sendStatus(401);
    next();
  };
};

module.exports = verifyRoles;
