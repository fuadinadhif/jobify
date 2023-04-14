const attachCookies = ({ res, token }) => {
  const sixMonths = 1000 * 60 * 60 * 24 * 30 * 6;

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + sixMonths),
    secure: process.env.NODE_ENV === "production",
  });
};

export default attachCookies;
