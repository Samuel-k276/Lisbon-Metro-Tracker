import React from "react";
import styles from "./Tarifarios.module.scss";

const Tarifarios: React.FC = () => {
  return (
    <div className={styles.tarifariosPage}>
      <h1 className={styles.pageTitle}>Tarifários</h1>
      <div className={styles.introBanner}>
        <p>Informações sobre títulos de transporte do Metro de Lisboa</p>
      </div>

      <section>
        <h2>
          Viagens Ocasionais{" "}
          <span className={styles.sectionSubtitle}>Bilhetes para utilizações pontuais</span>
        </h2>

        <div className={styles.tariffGrid}>
          <div className={styles.tariffCard}>
            <div className={styles.tariffHeader}>
              <h3>Bilhete Carris/Metro</h3>
              <div className={styles.tariffPrice}>1,85&euro;</div>
            </div>
            <div className={styles.tariffBody}>
              <p>
                Válido em toda a rede da Carris e do Metro num número ilimitado de viagens durante
                60 minutos, contado entre a primeira e a última validação de entrada.
              </p>
              <p>Não permite utilizações consecutivas no Metro.</p>
            </div>
          </div>

          <div className={styles.tariffCard}>
            <div className={styles.tariffHeader}>
              <h3>Bilhete Diário (24h) - Carris/Metro</h3>
              <div className={styles.tariffPrice}>7,00&euro;</div>
            </div>
            <div className={styles.tariffBody}>
              <p>
                Válido durante 24h, após a primeira validação, para um número ilimitado de viagens
                em toda a rede da Carris e do Metro.
              </p>
            </div>
          </div>

          <div className={styles.tariffCard}>
            <div className={styles.tariffHeader}>
              <h3>Zapping</h3>
              <div className={styles.tariffPrice}>Carregamentos: 3&euro;-40&euro;</div>
            </div>
            <div className={styles.tariffBody}>
              <p>
                Título de transporte pré-pago que pode ser usado em vários operadores. O valor da
                viagem efetuada é descontado ao saldo remanescente do seu cartão.
              </p>
              <p>
                No Metro: <strong>1,66&euro; por viagem.</strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2>
          Viagens Frequentes{" "}
          <span className={styles.sectionSubtitle}>Passes para utilizadores regulares</span>
        </h2>

        <div className={styles.passesGrid}>
          <div className={styles.passCard}>
            <div className={`${styles.passHeader} ${styles.navegante}`}>
              <h3>Navegante Municipal</h3>
              <div className={styles.passPrice}>30&euro;</div>
            </div>
            <div className={styles.passBody}>
              <p>
                Válido nas redes Carris e Metro, dentro do Município de Lisboa e na CP até: Benfica
                (Linha de Sintra), Belém (Linha de Cascais) e Moscavide (Linha da Azambuja).
              </p>
              <p>
                <strong>Validade:</strong> 30 dias
              </p>
            </div>
          </div>

          <div className={styles.passCard}>
            <div className={`${styles.passHeader} ${styles.navegante}`}>
              <h3>Navegante Metropolitano</h3>
              <div className={styles.passPrice}>40&euro;</div>
            </div>
            <div className={styles.passBody}>
              <p>Válido na Área Metropolitana de Lisboa.</p>
              <p>
                <strong>Validade:</strong> 30 dias
              </p>
            </div>
          </div>

          <div className={styles.passCard}>
            <div className={`${styles.passHeader} ${styles.navegante}`}>
              <h3>Navegante +65</h3>
              <div className={styles.passPrice}>20&euro;</div>
            </div>
            <div className={styles.passBody}>
              <p>
                Válido na Área Metropolitana de Lisboa para clientes com idade igual ou superior a
                65 anos.
              </p>
              <p>
                <strong>Validade:</strong> 30 dias
              </p>
            </div>
          </div>

          <div className={styles.passCard}>
            <div className={`${styles.passHeader} ${styles.navegante}`}>
              <h3>Navegante Família</h3>
              <div className={styles.passPrice}>80&euro;</div>
            </div>
            <div className={styles.passBody}>
              <p>
                Válido na Área Metropolitana de Lisboa. Permite que cada família pague no máximo o
                valor equivalente a 2 passes Navegante.
              </p>
              <p>Exclusivo de agregados com domicílio fiscal na área metropolitana de Lisboa.</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2>
          Descontos <span className={styles.sectionSubtitle}>Circula PT (Antigo Social+)</span>
        </h2>

        <div className={styles.discountInfo}>
          <p className={styles.leadParagraph}>
            O Circula PT destina-se a indivíduos que, comprovadamente, aufiram rendimentos reduzidos
            ou sejam portadores de grau de incapacidade permanente, igual ou superior a 60%.
          </p>

          <div className={styles.discountTable}>
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
                    Navegante Metropolitano
                    <br />
                    Navegante Municipal
                    <br />
                    Navegante +65*
                  </td>
                  <td>A</td>
                  <td>50%</td>
                </tr>
                <tr>
                  <td>
                    Navegante Metropolitano
                    <br />
                    Navegante Municipal
                    <br />
                    Navegante +65
                  </td>
                  <td>B</td>
                  <td>25%</td>
                </tr>
              </tbody>
            </table>
            <p className={styles.note}>
              * O desconto sobre o navegante&reg; + 65 apenas se aplica a indivíduos maiores de 65
              anos.
            </p>
          </div>

          <div className={styles.eligibilityInfo}>
            <h3>A quem se destina</h3>
            <p>O Circula PT assume dois escalões de bonificação:</p>

            <div className={styles.eligibilityLevel}>
              <h4>Escalão A (desconto de 50% face ao valor do título base):</h4>
              <ul>
                <li>Beneficiários do Complemento Solidário para Idosos;</li>
                <li>Beneficiários do Rendimento Social de Inserção;</li>
                <li>Portadores de grau de incapacidade permanente igual ou superior a 80%.</li>
              </ul>
            </div>

            <div className={styles.eligibilityLevel}>
              <h4>Escalão B (desconto de 25% face ao valor do título base):</h4>
              <ul>
                <li>
                  Portadores de grau de incapacidade permanente igual ou superior a 60% e inferior a
                  80%.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2>
          Gratuidades <span className={styles.sectionSubtitle}>Transporte sem custos</span>
        </h2>

        <div className={styles.freePassInfo}>
          <div className={styles.freePassCard}>
            <div className={styles.freePassHeader}>
              <h3>Navegante Antigo Combatente</h3>
              <div className={styles.freePassLabel}>Gratuito</div>
            </div>
            <div className={styles.freePassBody}>
              <p>
                Os antigos combatentes, detentores do cartão de Antigo Combatente, e a/o viúva/o do
                antigo combatente já podem adquirir no Metro o navegante antigo combatente, que
                isenta o titular do pagamento das modalidades de passes abrangidas por este
                benefício.
              </p>
            </div>
          </div>

          <div className={styles.freePassCard}>
            <div className={styles.freePassHeader}>
              <h3>Crianças até 12 anos</h3>
              <div className={styles.freePassLabel}>Gratuito</div>
            </div>
            <div className={styles.freePassBody}>
              <p>
                Crianças até aos 12 anos não pagam para andar nos transportes públicos da Área
                Metropolitana de Lisboa.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2>Meios de Pagamento</h2>

        <div className={styles.paymentMethods}>
          <div className={styles.paymentMethod}>
            <h3>Cartão Bancário Contactless</h3>
            <p>
              O cartão bancário permite o pagamento e validação da viagem no Metro, desde que o
              cartão disponha de sistema contactless ativo. Em cada viagem, cada cartão ou
              dispositivo móvel, apenas pode ser utilizado por uma pessoa, não sendo permitida a sua
              utilização em grupo.
            </p>
          </div>

          <div className={styles.paymentMethod}>
            <h3>Lisboa Viva (Navegante)</h3>
            <p>
              Carregável com passes e zapping, o navegante personalizado é o cartão ideal para
              utilizadores que viajam frequentemente no transporte público. É um cartão
              personalizado para ser utilizado apenas pelo titular.
            </p>
          </div>

          <div className={styles.paymentMethod}>
            <h3>Viva Viagem</h3>
            <p>
              Cartão não personalizado, disponível nos balcões de atendimento e máquinas de venda
              automática, que pode ser carregado com bilhetes ocasionais ou zapping.
            </p>
          </div>
        </div>
      </section>

      <div className={styles.sourceInfo}>
        <p>
          <small>
            Fonte: Adaptado de{" "}
            <a href="https://www.metrolisboa.pt/comprar/" target="_blank" rel="noopener noreferrer">
              Metropolitano de Lisboa - Comprar
            </a>
          </small>
        </p>
        <p>
          <small>Preços atualizados em abril de 2025</small>
        </p>
      </div>
    </div>
  );
};

export { Tarifarios };
