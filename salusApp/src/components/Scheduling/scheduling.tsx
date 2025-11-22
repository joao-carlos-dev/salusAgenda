import "./scheduling.css";
import { useState } from "react";

interface DayCalendar {
  dateObje: Date;
  weekDay: string;
  dayNumber: string;
  month: string;
  isToday: boolean;
}

const Scheduling = () => {
  const [referenceDate, setReferenceDate] = useState(new Date());
  const formatString = (str: string) => str.replace(".", "").toUpperCase();

  const getWeekDays = (): DayCalendar[] => {
    const days: DayCalendar[] = [];
    const startOfWeek = new Date(referenceDate);

    const currentDay = startOfWeek.getDay();
    const distanceToMonday = currentDay === 0 ? -6 : 1 - currentDay;
    startOfWeek.setDate(startOfWeek.getDate() + distanceToMonday);

    for (let i = 0; i < 5; i++) {
      const tempDate = new Date(startOfWeek);
      tempDate.setDate(startOfWeek.getDate() + i);

      days.push({
        dateObje: tempDate,
        weekDay: formatString(
          new Intl.DateTimeFormat("pt-BR", { weekday: "short" }).format(
            tempDate
          )
        ),
        dayNumber: new Intl.DateTimeFormat("pt-BR", { day: "2-digit" }).format(
          tempDate
        ),
        month: formatString(
          new Intl.DateTimeFormat("pt-BR", { month: "short" }).format(tempDate)
        ),
        isToday: tempDate.toDateString() === new Date().toDateString(),
      });
    }
    return days;
  };

  const handlerPrevWeek = () => {
    const newDate = new Date(referenceDate);
    newDate.setDate(referenceDate.getDate() - 7);
    setReferenceDate(newDate);
  };

  const handlerNextWeek = () => {
    const newDate = new Date(referenceDate);
    newDate.setDate(referenceDate.getDate() + 7);
    setReferenceDate(newDate);
  };

  const weekDays = getWeekDays();

  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const handleDayClick = (date: Date) => {
    setSelectedDate(date.toDateString());
    //vêm api
  };
  return (
    <section className="containerScheduling">
      <div className="header">
        <h2>Selecione uma data:</h2>
        <div className="navButtons">
          <button onClick={handlerPrevWeek}>
            <i className="bi bi-arrow-left"></i>
          </button>
          <button onClick={handlerNextWeek}>
            <i className="bi bi-arrow-right"></i>
          </button>
        </div>
      </div>

      <div className="daysWeeks">
        {weekDays.map((item, index) => {
          const isSelected =
            selectedDate && item.dateObje.toISOString() === selectedDate;

          return (
            <div
              key={index}
              className={`days ${isSelected ? "selected" : ""} ${
                item.isToday ? "today" : ""
              }`}
              onClick={() => handleDayClick(item.dateObje)}
            >
              <span className="dayWeek">{item.weekDay}</span>
              <span className="dayNumber">{item.dayNumber}</span>
              <span className="dayNumber">{item.month}</span>
            </div>
          );
        })}
      </div>

      <div className="containerHours">
        <span className="hours disabled">08:00</span>
        <span className="hours disabled">09:00</span>
        <span className="hours disabled">10:00</span>
        <span className="hours selected">11:00</span>
        <span className="hours bordered">12:00</span>
      </div>

      <button className="btn-agendar">Agendar</button>
    </section>
  );
};

export default Scheduling;
