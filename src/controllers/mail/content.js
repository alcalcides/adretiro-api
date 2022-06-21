export function getMessage(link) {
return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="pt-br">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>Recuperação de Senha</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <style type="text/css">
  	body {
  		color: linen;
    	background-color: #000B3A;
      padding-right: 2rem;
      padding-left: 2rem;
      position: relative;
      left: auto;
      right: auto;
      text-align: center;
      padding-top: 1rem;
      padding-bottom: 2rem;
  	}
    div.CTA {
      min-height: 6rem;
      margin-top: 3rem;
    }
    button {
      padding: 1rem 2rem;
      color: #000B3A;
      font-size: 1.2rem;
      font-family: Helvetica, sans-serif;
      font-weight: 500;
      border-radius: 0.5rem;
      border-color: #f3f3f3;
      text-shadow: 1px 1px 2px #292929;
      font-style: normal;
      cursor: pointer;
    }
    button:hover {
      font-style: italic;
    }
    button:active {
      font-size: 1.5rem;
    }
    header {
      font-size: 2rem;
    }
    p{
      font-family: Helvetica, sans-serif;
      font-size: 1.2rem;
      text-align: left;
      line-height: 1.3rem;
      margin: 1rem auto;
    }
    p.obs{
      font-family: "Lucida Console", "Courier New", monospace;
      color: gray;
      line-height: 2rem;
    }
  </style>
  <body>
  	<header>
      <h1>ADRetiro</h1>
      <h2>Recuperação de Senha</h2>
  	</header>
    <hr>
    <main>
      <p>A recuperação de senha é feita pela substituição da senha atual por uma nova.</p>
      <p>Prossiga para redefinir sua senha</p>
  	  <div class="CTA">
  		  <a href=${link}><button>Redefinir Senha</button></a>
  	  </div>
    </main>
    <footer>
  		<p class="obs">Este link expira em 3 horas</p>      
    </footer>
  </body>
</html>
`

}
