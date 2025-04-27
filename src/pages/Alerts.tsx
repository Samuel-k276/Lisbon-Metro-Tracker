import { fetchLineStateAll } from "../api/metro";
import { LineState } from "../types/metro";
import { useEffect, useState } from "react";
import { 
   Card, 
   CardContent, 
   Typography, 
   Box, 
   Chip, 
   CircularProgress, 
   Alert, 
   AlertTitle,
   Fade,
   Grow
} from '@mui/material';
import { LINE_COLORS } from "../constants/metroLines";

// Importar as imagens das linhas do metro
import linhaAzulImg from "../assets/linhaAzul.png";
import linhaAmarelaImg from "../assets/linhaAmarela.png";
import linhaVerdeImg from "../assets/linhaVerde.png";
import linhaVermelhaImg from "../assets/linhaVermelha.png";

const Alerts: React.FC = () => {
   const [lineStates, setLineStates] = useState<LineState[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
      const getLineStates = async () => {
         try {
            const states = await fetchLineStateAll();
            setLineStates(states);
            setLoading(false);
         } catch (err) {
            setError("Failed to fetch line states");
            setLoading(false);
         }
      };

      getLineStates();
   }, []);

   // Função para determinar a cor do alerta com base no status
   const getStatusColor = (status: string): string => {
      switch (status.toLowerCase()) {
         case "normal":
            return "#10b981"; // Cor verde mais agradável
         case "conditional":
         case "conditioned":
            return "#f59e0b"; // Cor amarela mais agradável
         case "interrupted":
         case "closed":
            return "#ef4444"; // Cor vermelha mais agradável
         default:
            return "#6b7280"; // Cinza
      }
   };

   // Função para determinar o ícone do alerta com base no status
   const getStatusIcon = (status: string): string => {
      if (status === "Ok") {
         return "✓"; // Ícone de checkmark
      } else {
         return "⚠️"; // Ícone de aviso
      }
   };

   // Função para determinar o estilo do cartão baseado na linha de metrô
   const getLineStyle = (lineName: string) => {
      let primaryColor, lightColor, gradientColor;
      
      switch (lineName.toLowerCase()) {
         case "azul":
            primaryColor = LINE_COLORS.Azul;
            lightColor = "#93c5fd";
            gradientColor = `linear-gradient(135deg, #93c5fd 0%, ${LINE_COLORS.Azul} 100%)`;
            break;
         case "amarela":
            primaryColor = LINE_COLORS.Amarela;
            lightColor = "#fde68a";
            gradientColor = `linear-gradient(135deg, #fde68a 0%, ${LINE_COLORS.Amarela} 100%)`;
            break;
         case "verde":
            primaryColor = LINE_COLORS.Verde;
            lightColor = "#6ee7b7";
            gradientColor = `linear-gradient(135deg, #6ee7b7 0%, ${LINE_COLORS.Verde} 100%)`;
            break;
         case "vermelha":
            primaryColor = LINE_COLORS.Vermelha;
            lightColor = "#fca5a5";
            gradientColor = `linear-gradient(135deg, #fca5a5 0%, ${LINE_COLORS.Vermelha} 100%)`;
            break;
         default:
            primaryColor = "#6b7280";
            lightColor = "#d1d5db";
            gradientColor = "linear-gradient(135deg, #d1d5db 0%, #6b7280 100%)";
      }
      
      return {
         primaryColor,
         lightColor,
         gradientColor
      };
   };

   // Função para obter o nome traduzido da linha
   const getLineName = (lineName: string): string => {
      const lineNames: Record<string, string> = {
         "azul": "Azul (Blue)",
         "amarela": "Amarela (Yellow)",
         "verde": "Verde (Green)",
         "vermelha": "Vermelha (Red)"
      };
      
      return lineNames[lineName.toLowerCase()] || lineName;
   };

   // Função para obter a imagem da linha correspondente
   const getLineImage = (lineName: string): string => {
      switch (lineName.toLowerCase()) {
         case "azul":
            return linhaAzulImg;
         case "amarela":
            return linhaAmarelaImg;
         case "verde":
            return linhaVerdeImg;
         case "vermelha":
            return linhaVermelhaImg;
         default:
            return linhaAzulImg; // Imagem padrão caso não encontre a linha
      }
   };

   return (
      <Box 
         sx={{ 
            p: 4, 
            backgroundColor: "#f9fafb",
            minHeight: "100vh",
            background: "linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)"
         }}
      >
         <Typography 
            variant="h3" 
            component="h1" 
            align="center" 
            gutterBottom 
            sx={{ 
               fontWeight: 700,
               mb: 5,
               color: "#1f2937",
               textShadow: "0px 2px 4px rgba(0,0,0,0.1)"
            }}
         >
            Metro Line Status
         </Typography>
         
         {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "40vh" }}>
               <CircularProgress size={60} thickness={4} />
            </Box>
         )}
         
         {error && (
            <Fade in={!!error} timeout={500}>
               <Alert 
                  severity="error" 
                  variant="filled"
                  sx={{ 
                     mb: 4,
                     boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                  }}
               >
                  <AlertTitle>Error</AlertTitle>
                  {error}
               </Alert>
            </Fade>
         )}
         
         {!loading && !error && (
            <Box 
               sx={{ 
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                  gap: 4
               }}
            >
               {lineStates.map((lineState, index) => {
                  const { primaryColor, gradientColor } = getLineStyle(lineState.name);
                  const statusColor = getStatusColor(lineState.status);
                  const lineImage = getLineImage(lineState.name);
                  
                  return (
                     <Grow
                        in={true}
                        key={index}
                        style={{ transformOrigin: '0 0 0' }}
                        timeout={(index + 1) * 200}
                     >
                        <Card 
                           sx={{
                              borderRadius: 2,
                              overflow: "hidden",
                              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                              transition: "transform 0.3s, box-shadow 0.3s",
                              "&:hover": {
                                 transform: "translateY(-5px)",
                                 boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                              },
                              position: "relative",
                              "&::before": {
                                 content: '""',
                                 position: "absolute",
                                 top: 0,
                                 left: 0,
                                 width: "6px",
                                 height: "100%",
                                 backgroundColor: statusColor,
                                 zIndex: 1
                              }
                           }}
                        >
                           <Box 
                              sx={{
                                 background: gradientColor,
                                 p: 2,
                                 display: "flex",
                                 alignItems: "center"
                              }}
                           >
                              <Box 
                                 sx={{
                                    width: 60,
                                    height: 60,
                                    borderRadius: "50%",
                                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    boxShadow: "0 3px 5px rgba(0, 0, 0, 0.1)",
                                    border: `1.5px solid ${primaryColor}`,
                                    padding: "2px",
                                    overflow: "hidden"
                                 }}
                              >
                                 <img 
                                    src={lineImage} 
                                    alt={`Linha ${lineState.name}`}
                                    style={{
                                       maxWidth: "100%", // Reduzido de 80% para 60%
                                       maxHeight: "100%", // Reduzido de 80% para 60%
                                       objectFit: "contain",
                                    }}
                                 />
                              </Box>
                              <Typography 
                                 variant="h5" 
                                 component="h2" 
                                 sx={{ 
                                    ml: 2, 
                                    color: "white", 
                                    fontWeight: "bold",
                                    textShadow: "0px 1px 2px rgba(0,0,0,0.2)"
                                 }}
                              >
                                 {getLineName(lineState.name)}
                              </Typography>
                           </Box>
                           
                           <CardContent sx={{ p: 3 }}>
                              <Box sx={{ display: "flex", alignItems: "flex-start", mb: lineState.message && lineState.message !== "0" ? 2 : 0 }}>
                                 <Typography variant="body1" component="span" fontWeight="medium" sx={{ mr: 2, mt: 0.5 }}>
                                    Status:
                                 </Typography>
                                 <Chip
                                    label={
                                       <Box sx={{ display: "flex", alignItems: "center" }}>
                                          <Typography component="span" sx={{ mr: 1 }}>
                                             {getStatusIcon(lineState.status)}
                                          </Typography>
                                          <Typography 
                                             component="span" 
                                             sx={{
                                                display: 'inline-block',
                                                whiteSpace: 'normal', 
                                                wordBreak: 'break-word',
                                                textAlign: 'left',
                                                lineHeight: 1.4
                                             }}
                                          >
                                             {lineState.status}
                                          </Typography>
                                       </Box>
                                    }
                                    sx={{
                                       backgroundColor: `${statusColor}20`, // 20% de opacidade
                                       color: statusColor,
                                       fontWeight: "bold",
                                       borderRadius: "16px",
                                       border: `1px solid ${statusColor}`,
                                       height: 'auto',
                                       '& .MuiChip-label': {
                                          display: 'block',
                                          whiteSpace: 'normal',
                                          py: 0.75,
                                          px: 1
                                       }
                                    }}
                                 />
                              </Box>
                              
                              {lineState.message && lineState.message !== "0" && (
                                 <Box 
                                    sx={{
                                       mt: 2,
                                       pt: 2,
                                       borderTop: "1px solid #e5e7eb",
                                       position: "relative"
                                    }}
                                 >
                                    <Typography 
                                       variant="body2" 
                                       component="p"
                                       sx={{
                                          fontStyle: "italic",
                                          color: "#4b5563",
                                          backgroundColor: "#f3f4f6",
                                          p: 2,
                                          borderRadius: 1,
                                          position: "relative",
                                          "&::before": {
                                             content: '"❝"',
                                             fontSize: "1.5rem",
                                             color: primaryColor,
                                             position: "absolute",
                                             top: "0.5rem",
                                             left: "0.5rem"
                                          },
                                          "&::after": {
                                             content: '"❞"',
                                             fontSize: "1.5rem",
                                             color: primaryColor,
                                             position: "absolute",
                                             bottom: "0",
                                             right: "0.5rem"
                                          },
                                          pl: 4, // Espaço extra para a citação à esquerda
                                          pr: 4  // Espaço extra para a citação à direita
                                       }}
                                    >
                                       {lineState.message}
                                    </Typography>
                                 </Box>
                              )}
                           </CardContent>
                        </Card>
                     </Grow>
                  );
               })}
            </Box>
         )}
      </Box>
   );
};

export default Alerts;
