import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

const URL_BACKEND = import.meta.env.VITE_API_URL;

Chart.register(...registerables);

const Dashboard: React.FC = () => {
  // Estados para los datos dinámicos
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [newUsersByMonth, setNewUsersByMonth] = useState<number[]>([]);

  const fetchData = async () => {
    try {
      const response = await fetch(`${URL_BACKEND}/user-statistics`);
      const data = await response.json();
      console.log(data)

      if (data) {
        setTotalUsers(data.totalUsers);
        //const dataUsers = data.newUsersByMonth.map((entry: { newUsers: number }) => entry.newUsers)
        // console.log(newUsersByMonth)
        setNewUsersByMonth(data.newUsersByMonth);
      }

    } catch (error) {
      console.error("Error fetching logs:", error);
    }

  };

  useEffect(() => {
    fetchData();
    console.log(newUsersByMonth);
  }, []);

  const data = {
    labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
    datasets: [
      {
        label: "Usuarios nuevos por mes",
        data: newUsersByMonth ? newUsersByMonth : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Valores predeterminados si aún no hay datos
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