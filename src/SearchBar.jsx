import { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';

function SearchBar({ onSearch }) {
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');

  const handleDayChange = (e) => setDay(e.target.value);
  const handleMonthChange = (e) => setMonth(e.target.value);
  const handleYearChange = (e) => setYear(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formattedDay = day.padStart(2, '0');
    const formattedMonth = month.padStart(2, '0');
    const formattedDate = `${year}${formattedMonth}${formattedDay}`;
    onSearch(formattedDate);
  };

  return (
    <Form onSubmit={handleSubmit} className="search-bar">
      <Row className="align-items-center justify-content-center">
        <Col xs="auto">
          <Form.Control
            type="number"
            min="1"
            max="31"
            value={day}
            placeholder="Day"
            onChange={handleDayChange}
            required
            className="mb-2 custom-input"
          />
        </Col>
        <Col xs="auto">
          <Form.Control
            type="number"
            min="1"
            max="12"
            value={month}
            placeholder="Month"
            onChange={handleMonthChange}
            required
            className="mb-2 custom-input"
          />
        </Col>
        <Col xs="auto">
          <Form.Control
            type="number"
            min="1852"
            max="2030"
            value={year}
            placeholder="Year"
            onChange={handleYearChange}
            required
            className="mb-2 custom-input"
          />
        </Col>
        <Col xs="auto">
          <Button type="submit" className="mb-2 custom-button">
            Search
          </Button>
        </Col>
      </Row>
    </Form>
  );
}

export default SearchBar;
