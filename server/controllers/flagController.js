import flagModel from "../models/flag";

class FlagController {
  static async createFlag(req, res) {
    try {
      const { car_id, reason, description } = req.body;
      const values = [car_id, reason, description];
      const flag = await flagModel.create(values);
      if (flag) {
        return res.status(201).json(flag);
      }
    } catch (err) {
      return res
        .status(500)
        .json({ error: true, message: "Internal server error" });
    }
  }
}

export default FlagController;
