import React from 'react';
import { useStore } from '../store/useStore';
import { SprintSelector } from './SprintSelector';
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock,
  AlertCircle,
  CheckCircle2,
  Calendar as CalendarIcon,
  ArrowRight,
  Users
} from 'lucide-react';

export const Calendar = () => {
  const { selectedProject, selectedSprint } = useStore();
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [view, setView] = React.useState<'month' | 'week'>('month');

  if (!selectedProject || !selectedSprint) return null;

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const getTasksForDay = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return selectedSprint.tasks.filter(task => {
      const taskDate = new Date(task.updatedAt);
      return taskDate.getDate() === day &&
             taskDate.getMonth() === date.getMonth() &&
             taskDate.getFullYear() === date.getFullYear();
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'todo':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + (direction === 'next' ? 1 : -1),
      1
    ));
  };

  const today = new Date();
  const isToday = (day: number) => {
    return day === today.getDate() &&
           currentDate.getMonth() === today.getMonth() &&
           currentDate.getFullYear() === today.getFullYear();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Sidebar */}
        <div className="w-full md:w-64 space-y-4">
          <SprintSelector />
          
          {/* Mini Calendar */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Vista Rápida</h3>
              <div className="flex gap-1">
                <button
                  onClick={() => setView('month')}
                  className={`p-2 rounded-lg ${
                    view === 'month' ? 'bg-primary-50 text-primary-600' : 'hover:bg-gray-100'
                  }`}
                >
                  <CalendarIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setView('week')}
                  className={`p-2 rounded-lg ${
                    view === 'week' ? 'bg-primary-50 text-primary-600' : 'hover:bg-gray-100'
                  }`}
                >
                  <Users className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="text-sm text-gray-600">
              <div className="font-medium text-gray-900 mb-1">
                {selectedSprint.name}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>
                  {new Date(selectedSprint.startDate).toLocaleDateString()} - 
                  {new Date(selectedSprint.endDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h3 className="font-medium mb-4">Resumen</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Tareas Totales</span>
                <span className="font-medium">{selectedSprint.tasks.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Completadas</span>
                <span className="font-medium text-green-600">
                  {selectedSprint.tasks.filter(t => t.status === 'done').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">En Progreso</span>
                <span className="font-medium text-blue-600">
                  {selectedSprint.tasks.filter(t => t.status === 'in_progress').length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Calendar Area */}
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-sm p-6">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigateMonth('prev')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => navigateMonth('next')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-4 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              >
                Hoy
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
              {/* Week days header */}
              {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
                <div
                  key={day}
                  className="bg-gray-50 p-2 text-center text-sm font-medium text-gray-600"
                >
                  {day}
                </div>
              ))}

              {/* Calendar days */}
              {Array.from({ length: 42 }, (_, i) => {
                const dayNumber = i - firstDayOfMonth + 1;
                const isCurrentMonth = dayNumber > 0 && dayNumber <= daysInMonth;
                const tasks = isCurrentMonth ? getTasksForDay(dayNumber) : [];

                return (
                  <div
                    key={i}
                    className={`bg-white min-h-[120px] p-2 ${
                      !isCurrentMonth ? 'text-gray-300' : ''
                    } ${isToday(dayNumber) ? 'bg-primary-50' : ''}`}
                  >
                    <div className={`font-medium mb-1 ${
                      isToday(dayNumber) ? 'text-primary-600' : ''
                    }`}>
                      {isCurrentMonth ? dayNumber : ''}
                    </div>
                    <div className="space-y-1">
                      {tasks.map((task) => (
                        <div
                          key={task.id}
                          className={`text-xs p-1 rounded ${getStatusColor(task.status)} truncate cursor-pointer hover:opacity-80`}
                          title={task.title}
                        >
                          {task.title}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-4 flex gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="text-sm">Completada</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="text-sm">En Progreso</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-600" />
                <span className="text-sm">Pendiente</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};