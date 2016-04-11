# Buteco Daideias IoT

Este projeto foi desenvolvido para ser apresentado durante o evento do Buteco Dasideia sobre IOT da MATERA Systems

#Componentes necesssários para o desenvolvimento deste prototipo

* 1 Arduino UNO
* 1 Shield de Ethernet modelo W5100
* 1 Leitor de RFID modelo RC522
* 1 Protoboard
* Jumpers para conectar os componentes (a forma de montar o prototipo pode variar de acordo com o gosto de quem está fazendo)


#Softwares necessários

##Instalando o Banco de Dados

Neste projeto, foi utilizado como banco de dados REDIS, que pode ser baixado por este [LINK](http://redis.io/download). Utilize a ultima versão disponivel na pagina.
Nesta mesma pagina existem instruções sobre a instalação do mesmo e como roda-lo, siga estas instruções, pois posteriormente será necessário ter o banco rodando

##Instalando o Node.JS

Utilizamos o NPM para gerencias as dependencias de front-end do projeto, para utilizar o NPM é necessário instalar o NODE.JS para utiliza-lo.

Acesse a pagina oficial do [NODE.JS](https://nodejs.org), nesta pagina estão as instruções de como instalar o node.js

## Instalando a IDE do Arduino

Para o desenvolvimento do prototipo de leitor de crachás com RFID foi utilizado o arduino no desenvolvimento do projeto, desta forma, será necessária a instalação da IDE de desenvolvimento do mesmo.

Acesse a pagina oficial do [Arduino](https://www.arduino.cc/en/Main/Software) e baixe e instale a IDE. Na própria pagina já existem instruções sobre a instalação da IDE.

#Montagem do Prototipo

A shield de ethernet se encaixa totalmente em cima do arduino, ou seja, não há exquema de pinagem para a mesma.

## Pinagem do leitor de RFID
* Pino SDA ligado na porta 7 do Arduino
* Pino SCK ligado na porta 13 do Arduino
* Pino MOSI ligado na porta 11 do Arduino
* Pino MISO ligado na porta 12 do Arduino
* Pino NC – Não conectado
* Pino GND  ligado no pino GND do Arduino
* Pino RST ligado na porta 8 do Arduino
* Pino 3.3 – ligado ao pino 3.3 V do Arduino

OBS: A shield de Ethernet já deve estar encaixada no arduino e os cabos jumpers encaixados nas entradas da shield.

#Configurações Previas.
Para que o prototipo funcione alguns itens precisam ser configurados

## Configuração do BD
A Entrada do Banco de Dados é feita através de um arquivo chamado database.json e que deve ficar na raiz da pasta **server**, neste arquivo, estão contidos os dados dos colabobaradores da empresa, tais como nome, codigo do cracha (que é o codigo RFID contido nos cartoes, tokens e etc) e o caminho da imagem do mesmo.
Este arquivo é constituido basicamente de um array de objetos com os dados citados anteriormente.
O layout do arquivo segue o seguinte formato:
```json
{
"users" : [
  {
    "code": "YOUR_RFID_CODE_HERE",
    "dados": { "nome" : "FULANO DA SILVA", "image" : "/avatars/FULANO.jpg"}
  }
]
}
```

O Banco de dados se atualiza quando a versão do projeto é atualizada, ou seja, caso queira atualizar sua base de colaboradores, basta editar o arquivo **package.json** e alterar a versão do projeto.

## Adicionando a Biblioteca RFID

Baixe a biblioteca [MFRC522](https://github.com/miguelbalboa/rfid) e adicione-a na sua IDE do arduino.

## Configurando a Rede
No codigo versionado considera que o PC que será o server que receberá os codigos lidos pelo prototipo terá o IP Fixo, assim como o arduino (Existem outras formas de configurar isto, então fique a vontade para alterar o codigo a seu gosto). A configuração da rede é a seguinte.

#### SERVER 
* IP: 192.168.0.1
* Mascara de Rede: 255.255.255.0
* Gateway Padrao: 192.168.0.1

#### Arduino
* IP: 192.168.0.2
* Mascara de Rede: 255.255.255.0
* Gateway Padrao: 192.168.0.1

OBS: O arquivo versionado, já configura o shield de ethernet neste padrão, ou seja, caso esta configuração lhe agrade, não será necessário configurar nada.
 
## Executando a aplicação
Finalmente, vamos colocar a aplicação para rodar.

###Subindo o BD
Suba o banco de acordo com as instruções citadas na pagina do projeto.

###Subindo o Server
Pelo terminal vá na raiz da pasta **server** e rode o seguinte comando **node app.js**

###Executando o arduino
Conecte o arduino ao seu PC com o cabo de rede, em seguida compile e suba o codigo para o arduino utilizando a IDE do mesmo. Neste momento o arduino já estará executando o codigo e esperando para fazer a leitura dos cartões.

### Vendo a aplicação funcionando
Acesse [http//192.168.0.1:3000](http//192.168.0.1:3000) quando a tela carregar totalmente, passe um cartão proximo ao leitor de RFID. Se o codigo do cartão estiver cadastrado na base, será exibida uma mensagem de bem-vindo ao usuario associado ao codigo.

## Entendendo o Funcionamento da Aplicação

Quando o server sobe, na pagina inicial, é aberto um websocket que fica escutando um determinado evento dentro do servidor. Este evento é disparado quando um serviço é acessado. Este serviço pode ser acessado pela url [http://localhost:3000/cartao](http://localhost:3000/cartao) e o mesmo espera receber um codigo de cartão, este codigo é passado por parametro na URL da seguinte forma: **/cartao?code=24%2009%20H2%20XO**

Este serviço captura este codigo e verifica se o mesmo existe está cadastrado na base, caso ele exista, ele dispara um exento para os sockets avisando que ele leu um cartão. Se existir algum ouvinte deste evento em especifico, ele irá capturar os dados passados e executar alguma ação com estes (no caso da nossa aplicação, no quando o evento é disparado ele passa os dados do usuario associado ao cartao que foi lido e monta uma tela de bem-vindo ao mesmo).

O que o arduino faz é basicamente ler os dados dos cartoes com o RFID e fazer uma chamada a este serviço.
