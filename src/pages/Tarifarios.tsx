import React from 'react';
import '../App.css';

const Tarifarios: React.FC = () => {
  return (
    <div className="tarifarios-page">
      <h1 className="page-title">Tarifários</h1>
      <div className="intro-banner">
        <p>Informações sobre títulos de transporte do Metro de Lisboa</p>
      </div>

      <section className="tariff-section">
        <h2>Viagens Ocasionais <span className="section-subtitle">Bilhetes para utilizações pontuais</span></h2>
        
        <div className="tariff-grid">
          <div className="tariff-card">
            <div className="tariff-header">
              <h3>Bilhete Carris/Metro</h3>
              <div className="tariff-price">1,85€</div>
            </div>
            <div className="tariff-body">
              <p>Válido em toda a rede da Carris e do Metro num número ilimitado de viagens durante 60 minutos, contado entre a primeira e a última validação de entrada.</p>
              <p>Não permite utilizações consecutivas no Metro.</p>
            </div>
          </div>

          <div className="tariff-card">
            <div className="tariff-header">
              <h3>Bilhete Diário (24h) - Carris/Metro</h3>
              <div className="tariff-price">7,00€</div>
            </div>
            <div className="tariff-body">
              <p>Válido durante 24h, após a primeira validação, para um número ilimitado de viagens em toda a rede da Carris e do Metro.</p>
            </div>
          </div>

          <div className="tariff-card">
            <div className="tariff-header">
              <h3>Zapping</h3>
              <div className="tariff-price">Carregamentos: 3€-40€</div>
            </div>
            <div className="tariff-body">
              <p>Título de transporte pré-pago que pode ser usado em vários operadores. O valor da viagem efetuada é descontado ao saldo remanescente do seu cartão.</p>
              <p>No Metro: <strong>1,66€ por viagem.</strong></p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="tariff-section">
        <h2>Viagens Frequentes <span className="section-subtitle">Passes para utilizadores regulares</span></h2>
        
        <div className="passes-grid">
          <div className="pass-card">
            <div className="pass-header navegante">
              <h3>Navegante Municipal</h3>
              <div className="pass-price">30€</div>
            </div>
            <div className="pass-body">
              <p>Válido nas redes Carris e Metro, dentro do Município de Lisboa e na CP até: Benfica (Linha de Sintra), Belém (Linha de Cascais) e Moscavide (Linha da Azambuja).</p>
              <p><strong>Validade:</strong> 30 dias</p>
            </div>
          </div>

          <div className="pass-card">
            <div className="pass-header navegante">
              <h3>Navegante Metropolitano</h3>
              <div className="pass-price">40€</div>
            </div>
            <div className="pass-body">
              <p>Válido na Área Metropolitana de Lisboa.</p>
              <p><strong>Validade:</strong> 30 dias</p>
            </div>
          </div>

          <div className="pass-card">
            <div className="pass-header navegante">
              <h3>Navegante +65</h3>
              <div className="pass-price">20€</div>
            </div>
            <div className="pass-body">
              <p>Válido na Área Metropolitana de Lisboa para clientes com idade igual ou superior a 65 anos.</p>
              <p><strong>Validade:</strong> 30 dias</p>
            </div>
          </div>

          <div className="pass-card">
            <div className="pass-header navegante">
              <h3>Navegante Família</h3>
              <div className="pass-price">80€</div>
            </div>
            <div className="pass-body">
              <p>Válido na Área Metropolitana de Lisboa. Permite que cada família pague no máximo o valor equivalente a 2 passes Navegante.</p>
              <p>Exclusivo de agregados com domicílio fiscal na área metropolitana de Lisboa.</p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="tariff-section">
        <h2>Descontos <span className="section-subtitle">Circula PT (Antigo Social+)</span></h2>
        
        <div className="discount-info">
          <p className="lead-paragraph">O Circula PT destina-se a indivíduos que, comprovadamente, aufiram rendimentos reduzidos ou sejam portadores de grau de incapacidade permanente, igual ou superior a 60%.</p>
          
          <div className="discount-table">
            <table>
              <thead>
                <tr>
                  <th>Título base</th>
                  <th>Escalão</th>
                  <th>Desconto</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    Navegante Metropolitano<br />
                    Navegante Municipal<br />
                    Navegante +65*
                  </td>
                  <td>A</td>
                  <td>50%</td>
                </tr>
                <tr>
                  <td>
                    Navegante Metropolitano<br />
                    Navegante Municipal<br />
                    Navegante +65
                  </td>
                  <td>B</td>
                  <td>25%</td>
                </tr>
              </tbody>
            </table>
            <p className="note">* O desconto sobre o navegante® + 65 apenas se aplica a indivíduos maiores de 65 anos.</p>
          </div>
          
          <div className="eligibility-info">
            <h3>A quem se destina</h3>
            <p>O Circula PT assume dois escalões de bonificação:</p>
            
            <div className="eligibility-level">
              <h4>Escalão A (desconto de 50% face ao valor do título base):</h4>
              <ul>
                <li>Beneficiários do Complemento Solidário para Idosos;</li>
                <li>Beneficiários do Rendimento Social de Inserção;</li>
                <li>Portadores de grau de incapacidade permanente igual ou superior a 80%.</li>
              </ul>
            </div>
            
            <div className="eligibility-level">
              <h4>Escalão B (desconto de 25% face ao valor do título base):</h4>
              <ul>
                <li>Portadores de grau de incapacidade permanente igual ou superior a 60% e inferior a 80%.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      <section className="tariff-section">
        <h2>Gratuidades <span className="section-subtitle">Transporte sem custos</span></h2>
        
        <div className="free-pass-info">
          <div className="free-pass-card">
            <div className="free-pass-header">
              <h3>Navegante Antigo Combatente</h3>
              <div className="free-pass-label">Gratuito</div>
            </div>
            <div className="free-pass-body">
              <p>Os antigos combatentes, detentores do cartão de Antigo Combatente, e a/o viúva/o do antigo combatente já podem adquirir no Metro o navegante antigo combatente, que isenta o titular do pagamento das modalidades de passes abrangidas por este benefício.</p>
            </div>
          </div>
          
          <div className="free-pass-card">
            <div className="free-pass-header">
              <h3>Crianças até 12 anos</h3>
              <div className="free-pass-label">Gratuito</div>
            </div>
            <div className="free-pass-body">
              <p>Crianças até aos 12 anos não pagam para andar nos transportes públicos da Área Metropolitana de Lisboa.</p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="payment-section">
        <h2>Meios de Pagamento</h2>
        
        <div className="payment-methods">
          <div className="payment-method">
            <h3>Cartão Bancário Contactless</h3>
            <p>O cartão bancário permite o pagamento e validação da viagem no Metro, desde que o cartão disponha de sistema contactless ativo. Em cada viagem, cada cartão ou dispositivo móvel, apenas pode ser utilizado por uma pessoa, não sendo permitida a sua utilização em grupo.</p>
          </div>
          
          <div className="payment-method">
            <h3>Lisboa Viva (Navegante)</h3>
            <p>Carregável com passes e zapping, o navegante personalizado é o cartão ideal para utilizadores que viajam frequentemente no transporte público. É um cartão personalizado para ser utilizado apenas pelo titular.</p>
          </div>
          
          <div className="payment-method">
            <h3>Viva Viagem</h3>
            <p>Cartão não personalizado, disponível nos balcões de atendimento e máquinas de venda automática, que pode ser carregado com bilhetes ocasionais ou zapping.</p>
          </div>
        </div>
      </section>
      
      <div className="source-info">
        <p><small>Fonte: Adaptado de <a href="https://www.metrolisboa.pt/comprar/" target="_blank" rel="noopener noreferrer">Metropolitano de Lisboa - Comprar</a></small></p>
        <p><small>Preços atualizados em abril de 2025</small></p>
      </div>
    </div>
  );
};

export default Tarifarios;