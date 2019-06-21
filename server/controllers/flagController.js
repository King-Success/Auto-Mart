import flagModel from '../models/flag';

class FlagController {
  static async createFlag(req, res) {
    try {
      const { carId, reason, description } = req.body;
      const values = [carId, reason, description];
      const flag = await flagModel.create(values);
      if (flag) {
        return res.status(201).json({
          status: 201,
          data: [flag],
          message: 'Car Ad has been flaged successfully',
        });
      }
    } catch (err) {
      return res.status(500).json({ error: true, message: 'Internal server error' });
    }
  }
}

export default FlagController;
