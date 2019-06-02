class Helpers {
  static extractErrors(errors) {
    const validationErrors = [];
    errors.map(error => validationErrors.push(error.msg));
    return validationErrors;
  }

  static isANumber(num) {
    return Number.isInteger(Number(num));
  }

  static updateModel(req, res, model, data, id, name) {
    for (let i = 0; i < model.length; i += 1) {
      if (model[i].id === id) {
        model.splice(i, 1);
        model.push(data);
        return res.status(200).json({
          status: 200,
          data: [data],
          message: `${name} Ad updated successfully`,
        });
      }
    }
  }
}

export default Helpers;
