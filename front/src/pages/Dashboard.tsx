import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import useDashboardData from "../services/useDashboardData";

Chart.register(...registerables);

// Principio SRP: Este componente solo se encarga de la UI del dashboard
const Dashboard: React.FC = () => {
  // Principio DIP: El hook abstrae la obtención de datos, el componente no depende de fetch ni endpoints
  const { totalUsers, newUsersByMonth } = useDashboardData();

  const data = {
    labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
    datasets: [
      {
        label: "Usuarios nuevos por mes",
        data: newUsersByMonth ? newUsersByMonth : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        backgroundColor: "rgba(60,131,230,255)",
        borderColor: "rgba(60,131,230,255)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        grid: {
          display: true,
          drawBorder: false,
          color: "rgba(169, 169, 169, 0.3)",
          lineWidth: 1,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <Container fluid className="p-4" style={{ backgroundColor: "rgba(243,243,253,255)" }}>
      <h3 className="mb-5">Dashboard</h3>

      <Row className="mb-5">
        <Col md={4}>
          <Card className="mb-5">
            <Card.Body className="text-start">
              <Card.Title>Usuarios Totales</Card.Title>
              <Card.Text className="fs-3 text-center">
                {totalUsers} { }
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Usuarios nuevos por mes</Card.Title>
              <Bar data={data} options={options} /> { }
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;