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

  static apiLandingPage() {
    return `<!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <meta http-equiv="X-UA-Compatible" content="ie=edge">
              <title>Auto Mart</title>
              <style>
                * {
                  box-sizing: border-box;
                }
              html, body{
                height: 100vh;
              }
              body {
                padding: 0;
                margin: 0;
              }
              
              .container {
                border: 1px solid #6784C7;
                height: 100vh;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
              }
              .container> div {
            
                font-size: 15rem;
                text-align: center;
                
              }
              hr {
                border: 1px solid #6784C7;
                width: 10rem;
                padding: 0;
                margin: 0;
              }
              @media screen and (min-width: 768px) {
                .error {
                  width: 300px;
                }
              }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>Auto Mart</h1>
                <h3>Built by: <a href="https://twitter.com/StoicDeveloper_">Stoic Developer</a></h3> <hr>
                <h2>Read Documentaion <a href="/api/docs">Here</a></h2> 
              </div>
            </body>
            </html>`;
  }
}

export default Helpers;
