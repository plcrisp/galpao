# Gerenciamento de Galpões - Sistema de Estoque e Logística

Este é um software de gerenciamento de galpões para uma empresa da indústria agrícola, desenvolvido pelos alunos:

Flávio Rosim de Sousa - 2022003844

Gabriel Gonçalves Sampaio - 2022004467

Pedro Lucas Crisp Pinto - 2022003272

Samuel Amadeu Loureiro - 2022003960

Gustavo Inácio Arraes Fernandes - 2024013410



## Descrição do Sistema

O sistema foi projetado para gerenciar galpões de uma empresa da indústria agrícola, armazenando diferentes tipos de produtos, como sementes e mudas.

## Funcionalidades Principais
Cadastro de Produtos: O sistema permite o cadastro de diferentes produtos, com funcionalidades de CRUD (Criar, Ler, Atualizar, Excluir), possibilitando a gestão eficiente dos produtos armazenados.

Gestão de Estoque: O sistema gerencia os estoques de diversos galpões espalhados pelo território nacional, com a possibilidade de registrar a chegada de lotes de produtos e registrar baixas no estoque.

Localização de Galpões: Através da geolocalização, o sistema permite identificar o galpão mais próximo do usuário para otimizar as entregas.

Cálculo Logístico: O sistema calcula a logística de entregas com base na disponibilidade de estoque. Caso um galpão não tenha quantidade suficiente de determinado produto, o sistema realiza o planejamento da entrega com múltiplos galpões próximos para garantir que a demanda seja atendida de maneira eficaz e rápida.

## Fluxo de Operação

O usuário registra a chegada de novos lotes ou realiza a baixa de estoque nos galpões.

O sistema calcula automaticamente a disponibilidade dos produtos em estoque e, caso seja necessário, utiliza galpões próximos para realizar a entrega completa da demanda.

O sistema indica ao usuário o galpão mais próximo para otimizar o processo de entrega.

## Como Executar o Projeto

Clone o Repositório

```bash
git clone https://github.com/plcrisp/galpao.git
```

Instale as Dependências. Navegue até a pasta do projeto e execute o comando:

```bash
npm install
```

Execute o Servidor Local Para rodar o projeto em seu ambiente local, execute o comando:

```bash
ng serve
```

Abra o navegador e acesse http://localhost:4200 para visualizar o sistema.

## Tecnologias Utilizadas

Angular: Framework para construção da interface do usuário.

Firebase: Utilizado para o armazenamento de dados e autenticação.

API de Geolocalização: Para determinar os galpões mais próximos.

## Contribuição
Este projeto foi desenvolvido com o objetivo de aprimorar os conhecimentos dos alunos em sistemas de gerenciamento e logística, além de ser uma solução prática para o gerenciamento de estoques e entregas de uma empresa do setor agrícola.

## Licença
Este projeto é de autoria dos alunos acima citados e pode ser utilizado para fins acadêmicos e de estudo.