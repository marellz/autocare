import type { Request, Response } from "express";

const AuthController = () => {
  const register = () => {}; // ignore for now
  const logout = (request: Request, response: Response) => {
    if (!request.user) {
      return response
        .status(401)
        .json({ message: "error", error: "unauthorized" });
    }

    request.logout((err) => {
      if (err) {
        return response.status(400).json({ message: "error", error: err });
      }
      request.session.destroy(() => {
        return response.status(200).json({ message: "ok" });
      });
    });
  };

  const getUser = (request: Request, response: Response) => {
    const { user } = request;
    if (!user) {
      response.status(401).json({ message: "error", error: "User not found" });
      return;
    }

    response.status(200).json({ message: "ok", data: { user } });
  };

  return {
    register,
    logout,
    getUser,
  };
};

export default AuthController;
