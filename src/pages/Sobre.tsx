import React from 'react';
import '../App.css';

const Sobre: React.FC = () => {
  return (
    <div className="sobre-page">
      <h1 className="page-title">Metropolitano de Lisboa</h1>
      <div className="intro-banner">
        <p>Inaugurado em 1959, o primeiro e maior sistema de metropolitano de Portugal</p>
      </div>
      
      <section className="history-section">
        <h2>História <span className="section-subtitle">Mais de seis décadas de mobilidade</span></h2>
        
        <p className="lead-paragraph">
          O Metropolitano de Lisboa é o sistema de metropolitano que serve a cidade de Lisboa, Portugal.
          Foi criado por escritura pública em 26 de janeiro de 1948 e inaugurado em 29 de dezembro de 1959,
          tornando-se assim na primeira rede de metropolitano de Portugal.
        </p>
        
        <h3>A Ideia</h3>
        <p>
          Desde 1888 que se pensava em construir um sistema de caminhos de ferro subterrâneo na cidade de Lisboa, 
          à semelhança das que já existiam em Londres, Budapeste e Glasgow, e da que estava a ser construída em Paris. 
          A ideia foi apresentada pelo engenheiro militar Henrique de Lima e Cunha.
        </p>

        <h3>Primeiros Passos</h3>
        <p>
          Em agosto de 1955 iniciou-se a construção dos primeiros troços, e em dezembro de 1959 foi finalmente inaugurada
          a primeira linha do Metropolitano de Lisboa, com uma rede de Y que ligava Sete Rios (atual Jardim Zoológico), 
          Entre Campos e Restauradores.
        </p>

        <div className="timeline">
          <div className="timeline-item">
            <h4>Década de 1960</h4>
            <p>
              Em maio de 1960 arrancaram as obras de prolongamento até à estação do Rossio, 
              inaugurada em 27 de janeiro de 1963. Em 1966, a rede foi expandida até aos Anjos, 
              com a abertura das estações Martim Moniz, Intendente e Anjos.
            </p>
          </div>
          
          <div className="timeline-item">
            <h4>Décadas de 1970-1980</h4>
            <p>
              Durante este período, a rede continuou a expandir-se gradualmente, 
              melhorando a mobilidade na cidade de Lisboa.
            </p>
          </div>

          <div className="timeline-item">
            <h4>Década de 1990</h4>
            <p>
              Em 1990 foi apresentado o Plano de Expansão da Rede (PER I), que previa os prolongamentos 
              Rossio—Cais do Sodré e Restauradores—Baixa-Chiado, entre outros. Esta década marcou uma 
              importante expansão da rede.
            </p>
          </div>

          <div className="timeline-item">
            <h4>Anos 2000 até hoje</h4>
            <p>
              A rede continuou a expandir-se, com a introdução da Linha Vermelha e extensões 
              das linhas existentes. Atualmente, está em desenvolvimento o projeto de expansão 
              que inclui a nova linha circular.
            </p>
          </div>
        </div>
      </section>

      <section className="network-section">
        <h2>A Rede Atual <span className="section-subtitle">4 linhas, 56 estações, 44,5 km de extensão</span></h2>
        
        <p className="lead-paragraph">
          O Metropolitano de Lisboa é constituído por quatro linhas com 56 estações, 
          seis das quais duplas, servindo diariamente milhares de passageiros.
        </p>
        
        <div className="metro-lines-grid">
          <div className="line azul">
            <div className="line-icon">13,7 km</div>
            <h3>Linha Azul</h3>
            <div className="line-terminals">
              <span className="terminal">Reboleira</span>
              <span className="direction-arrow">↔</span>
              <span className="terminal">Santa Apolónia</span>
            </div>
            <div className="line-stats">
              <div className="stat">
                <span className="stat-value">18</span>
                <span className="stat-label">Estações</span>
              </div>
              <div className="stat">
                <span className="stat-value">1959</span>
                <span className="stat-label">Inauguração</span>
              </div>
            </div>
          </div>
          
          <div className="line amarela">
            <div className="line-icon">11,0 km</div>
            <h3>Linha Amarela</h3>
            <div className="line-terminals">
              <span className="terminal">Odivelas</span>
              <span className="direction-arrow">↔</span>
              <span className="terminal">Rato</span>
            </div>
            <div className="line-stats">
              <div className="stat">
                <span className="stat-value">13</span>
                <span className="stat-label">Estações</span>
              </div>
              <div className="stat">
                <span className="stat-value">1959</span>
                <span className="stat-label">Inauguração</span>
              </div>
            </div>
          </div>
          
          <div className="line verde">
            <div className="line-icon">9,0 km</div>
            <h3>Linha Verde</h3>
            <div className="line-terminals">
              <span className="terminal">Telheiras</span>
              <span className="direction-arrow">↔</span>
              <span className="terminal">Cais do Sodré</span>
            </div>
            <div className="line-stats">
              <div className="stat">
                <span className="stat-value">13</span>
                <span className="stat-label">Estações</span>
              </div>
              <div className="stat">
                <span className="stat-value">1963</span>
                <span className="stat-label">Inauguração</span>
              </div>
            </div>
          </div>
          
          <div className="line vermelha">
            <div className="line-icon">11,5 km</div>
            <h3>Linha Vermelha</h3>
            <div className="line-terminals">
              <span className="terminal">Aeroporto</span>
              <span className="direction-arrow">↔</span>
              <span className="terminal">São Sebastião</span>
            </div>
            <div className="line-stats">
              <div className="stat">
                <span className="stat-value">12</span>
                <span className="stat-label">Estações</span>
              </div>
              <div className="stat">
                <span className="stat-value">1998</span>
                <span className="stat-label">Inauguração</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="art-section">
        <h2>A Arte no Metro <span className="section-subtitle">Um museu subterrâneo</span></h2>
        <p className="lead-paragraph">
          Uma das características distintivas do Metropolitano de Lisboa é a integração de arte 
          nas suas estações. Muitas estações contam com azulejos decorativos e obras de arte de 
          artistas portugueses de renome, tornando cada estação única e culturalmente significativa.
        </p>
        <div className="art-info">
          <div className="art-fact">
            <span className="art-number">+500</span>
            <span className="art-description">Obras de arte</span>
          </div>
          <div className="art-fact">
            <span className="art-number">+200</span>
            <span className="art-description">Artistas</span>
          </div>
          <div className="art-fact">
            <span className="art-number">1959</span>
            <span className="art-description">Desde a inauguração</span>
          </div>
        </div>
      </section>

      <section className="future-section">
        <h2>Projetos Futuros <span className="section-subtitle">O metro em expansão</span></h2>
        <div className="future-projects">
          <div className="project-card">
            <h3>LIOS</h3>
            <p className="project-description">
              Linha Intermodal Sustentável, um conjunto de duas linhas de metro ligeiro de superfície:
            </p>
            <ul className="project-details">
              <li><strong>LIOS Ocidental:</strong> Alcântara a Oeiras</li>
              <li><strong>LIOS Oriental:</strong> Santa Apolónia a Sacavém</li>
            </ul>
          </div>
          
          <div className="project-card">
            <h3>Expansão da Linha Vermelha</h3>
            <p className="project-description">
              Extensão até Campo de Ourique, com passagem por:
            </p>
            <ul className="project-details">
              <li>Campolide</li>
              <li>Amoreiras</li>
              <li>Ligação à estação Ferroviária de Campolide</li>
            </ul>
          </div>
        </div>
      </section>

      <div className="source-info">
        <p><small>Fonte: Adaptado de <a href="https://pt.wikipedia.org/wiki/Metropolitano_de_Lisboa" target="_blank" rel="noopener noreferrer">Wikipedia - Metropolitano de Lisboa</a></small></p>
      </div>
    </div>
  );
};

export default Sobre;


