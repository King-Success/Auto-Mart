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
  static resetEmail(url) {
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
                height: 50vh;
                align-items: center;
                padding: 20px;
              }
              
              a {
                background: #092467;
                border: none;
                outline: none;
                color: white;
                font-size: 0.8rem;
                cursor: pointer;
                opacity: 0.8;
                padding: 0.8rem;
                width: 10rem;
                text-align: center;
                font-size: 1rem;
              }
              a:hover {
                opacity: 1;
              }
              </style>
            </head>
            <body>
              <div class="container">
                  <h1>Password reset</h1>
                  <p>You requested for a password reset on Auto Mart</p>
                  <p>Kindly click the link below to complete the action</p><br>
                  <a href="${url}">Reset</a>
              </div>
            </body>
            </html>`;
  }

  static errorTemplate(error) {
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
                border: 1px solid #6784C7;;
                height: 100vh;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
              }
              .error {
                width: 250px;
                overflow-wrap: break-word;
                background: #092467;
                color: white;
                font-size: 18px;
                text-align: center;
                padding: 20px 0;
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
                <div class="error">${error}</div>
              </div>
            </body>
            </html>`;
  }

  static resetTemplate(email = '', error = '') {
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
              .form-container {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                height: 80vh;
              }
              .border{
                border: 1px solid #092467;
                padding: 80px;
                background: #092467;
                border-radius: 8px;
                height: 380px;
              }
              input {
                height: 40px;
                border: none;
                margin-bottom: 13px;
                padding-left: 10px;
                border-radius: 4px;
                font-size: 14px;
                transition: all 0.2s ease-in-out;
              }
              .container {
                height: 100vh;
              }
              .form-group {
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
              }

              label{
                color: white;
              }
              input[type="submit"]{
                background: gray;
                border: none;
                outline: none;
                color: black;
                font-size: 16px;
                cursor: pointer;
                opacity: 0.8;
              }
              
              input[type="submit"]:hover{
                opacity: 1;
              }
              .alert{
                padding: 10px;
                text-align: center;
                width: 250px;
                background: red;
                color: aliceblue;
                font-style: bold;
                overflow-wrap: break-word;
              }
              @media screen and (min-width: 768px) {
                input, .alert {
                  width: 350px;
                }
              }
              </style>
            </head>
            <body>
              <div class="container">
                <form action="/api/v1/users/reset" method="post">
                  <div class="form-container">
                  <div class="border">
                      ${error}
                      <div class="form-group">
                          <input name="password" type="password" placeholder="New password">
                      </div>
                      <div class="form-group">
                          <input name="passwordConfirmation" type="password" placeholder="Confirm password">
                      </div>
                      <input type="hidden" name="email" value="${email}">
                      <input type="submit" value="Reset">
                    </div>
                  </div>
                </form>
              </div>
            </body>
            </html>`;
  }

  static successTemplate(success, url = '') {
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
                border: 1px solid #6784C7;;
                height: 100vh;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
              }
              .success {
                width: 250px;
                overflow-wrap: break-word;
                background: #092467;
                color: white;
                font-size: 16px;
                text-align: center;
                padding: 20px 0;
              }

              a{
                color: gray;
              }
              @media screen and (min-width: 768px) {
                .success {
                  width: 300px;
                }
              }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="success">${success} ${url}</div>
                
              </div>
            </body>
            </html>`;
  }
}

export default Helpers;
