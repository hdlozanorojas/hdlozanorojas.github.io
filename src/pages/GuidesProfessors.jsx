import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap,
  Award,
  BookOpen,
  Users,
  Calendar,
  Clock,
  Video,
  FileText,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import './GuidesProfessors.css'

const GuidesProfessors = () => {
  const navigate = useNavigate()
  const [expandedFaculty, setExpandedFaculty] = useState(null)
  const [selectedProgram, setSelectedProgram] = useState('all')

  const professors = [
    {
      id: 1,
      name: 'Dr. Ana María González',
      program: 'sistemas',
      title: 'Directora de Ingeniería de Sistemas',
      specialization: 'Inteligencia Artificial y Machine Learning',
      email: 'ana.gonzalez@ucentral.edu.co',
      phone: '+57 1 323-9868 ext. 1201',
      office: 'Edificio C, Oficina 301',
      education: [
        'Ph.D. en Ciencias de la Computación - MIT',
        'M.Sc. en Inteligencia Artificial - Stanford University',
        'Ing. de Sistemas - Universidad Central'
      ],
      experience: '15 años en investigación de IA',
      courses: ['Algoritmos de IA', 'Deep Learning', 'Procesamiento de Lenguaje Natural'],
      research: 'Redes neuronales profundas aplicadas a visión por computadora',
      publications: 45,
      avatar: '👩‍💻',
      available: true,
      officeHours: 'Lunes y Miércoles 2:00-4:00 PM'
    },
    {
      id: 2,
      name: 'Dr. Carlos Andrés Ruiz',
      program: 'ambiental',
      title: 'Profesor Titular - Ingeniería Ambiental',
      specialization: 'IA para Sostenibilidad y Cambio Climático',
      email: 'carlos.ruiz@ucentral.edu.co',
      phone: '+57 1 323-9868 ext. 1305',
      office: 'Edificio B, Oficina 205',
      education: [
        'Ph.D. en Ingeniería Ambiental - TU Delft',
        'M.Sc. en Sistemas Ambientales - ETH Zurich',
        'Ing. Ambiental - Universidad Central'
      ],
      experience: '12 años en modelamiento ambiental con IA',
      courses: ['Modelamiento Ambiental', 'IA Verde', 'Gestión Sostenible'],
      research: 'Algoritmos de optimización para gestión de recursos naturales',
      publications: 38,
      avatar: '🌱',
      available: true,
      officeHours: 'Martes y Jueves 10:00-12:00 PM'
    },
    {
      id: 3,
      name: 'Dra. Patricia Moreno',
      program: 'industrial',
      title: 'Coordinadora de Investigación - Ing. Industrial',
      specialization: 'Industria 4.0 e IA en Manufactura',
      email: 'patricia.moreno@ucentral.edu.co',
      phone: '+57 1 323-9868 ext. 1150',
      office: 'Edificio A, Oficina 410',
      education: [
        'Ph.D. en Ingeniería Industrial - Georgia Tech',
        'M.Sc. en Automatización Industrial - RWTH Aachen',
        'Ing. Industrial - Universidad Central'
      ],
      experience: '10 años en automatización inteligente',
      courses: ['Automatización Industrial', 'IoT y Sensores', 'Optimización de Procesos'],
      research: 'Sistemas ciber-físicos en manufactura inteligente',
      publications: 29,
      avatar: '🏭',
      available: false,
      officeHours: 'Viernes 9:00-11:00 AM'
    },
    {
      id: 4,
      name: 'Dr. Miguel Ángel Torres',
      program: 'electronica',
      title: 'Profesor Asociado - Ingeniería Electrónica',
      specialization: 'Sistemas Embebidos con IA',
      email: 'miguel.torres@ucentral.edu.co',
      phone: '+57 1 323-9868 ext. 1078',
      office: 'Edificio D, Laboratorio 102',
      education: [
        'Ph.D. en Ingeniería Electrónica - UC Berkeley',
        'M.Sc. en Sistemas Embebidos - KTH Stockholm',
        'Ing. Electrónica - Universidad Central'
      ],
      experience: '8 años en desarrollo de hardware para IA',
      courses: ['Microcontroladores', 'Sistemas Embebidos', 'IA en Edge Computing'],
      research: 'Optimización de algoritmos de IA para dispositivos de bajo consumo',
      publications: 22,
      avatar: '⚡',
      available: true,
      officeHours: 'Lunes y Viernes 3:00-5:00 PM'
    },
    {
      id: 5,
      name: 'Dr. Roberto Silva',
      program: 'mecanica',
      title: 'Director de Laboratorio de Robótica',
      specialization: 'Robótica Inteligente y Control Adaptativo',
      email: 'roberto.silva@ucentral.edu.co',
      phone: '+57 1 323-9868 ext. 1420',
      office: 'Edificio E, Laboratorio de Robótica',
      education: [
        'Ph.D. en Robótica - Carnegie Mellon University',
        'M.Sc. en Control Automático - EPFL',
        'Ing. Mecánica - Universidad Central'
      ],
      experience: '13 años en robótica y control inteligente',
      courses: ['Robótica', 'Control Inteligente', 'Visión por Computadora'],
      research: 'Robots autónomos con aprendizaje por refuerzo',
      publications: 35,
      avatar: '🤖',
      available: true,
      officeHours: 'Miércoles y Jueves 1:00-3:00 PM'
    },
    {
      id: 6,
      name: 'Dra. Sofía Ramírez',
      program: 'biologia',
      title: 'Profesora Investigadora - Biología',
      specialization: 'Bioinformática e IA en Genómica',
      email: 'sofia.ramirez@ucentral.edu.co',
      phone: '+57 1 323-9868 ext. 1680',
      office: 'Edificio F, Laboratorio de Bioinformática',
      education: [
        'Ph.D. en Bioinformática - Harvard University',
        'M.Sc. en Biología Computacional - Cambridge University',
        'Bióloga - Universidad Central'
      ],
      experience: '9 años en análisis genómico con IA',
      courses: ['Bioinformática', 'Genómica Computacional', 'Análisis de Big Data Biológicos'],
      research: 'Predicción de estructura de proteínas usando deep learning',
      publications: 41,
      avatar: '🧬',
      available: true,
      officeHours: 'Martes 2:00-4:00 PM, Jueves 10:00-12:00 PM'
    },
    {
      id: 7,
      name: 'Dr. Fernando López',
      program: 'datos',
      title: 'Coordinador de Ciencias de Datos',
      specialization: 'Data Science y Analytics Avanzado',
      email: 'fernando.lopez@ucentral.edu.co',
      phone: '+57 1 323-9868 ext. 1750',
      office: 'Edificio G, Centro de Datos',
      education: [
        'Ph.D. en Estadística y Data Science - UC Berkeley',
        'M.Sc. en Machine Learning - University of Toronto',
        'Estadístico - Universidad Central'
      ],
      experience: '11 años en ciencia de datos y analytics',
      courses: ['Estadística Avanzada', 'Machine Learning', 'Big Data Analytics'],
      research: 'Algoritmos de clustering y clasificación para grandes volúmenes de datos',
      publications: 33,
      avatar: '📊',
      available: false,
      officeHours: 'Lunes y Miércoles 11:00 AM-1:00 PM'
    }
  ]

  const programs = [
    { id: 'all', name: 'Todos los Programas', count: professors.length },
    { id: 'sistemas', name: 'Ing. de Sistemas', count: professors.filter(p => p.program === 'sistemas').length },
    { id: 'ambiental', name: 'Ing. Ambiental', count: professors.filter(p => p.program === 'ambiental').length },
    { id: 'industrial', name: 'Ing. Industrial', count: professors.filter(p => p.program === 'industrial').length },
    { id: 'electronica', name: 'Ing. Electrónica', count: professors.filter(p => p.program === 'electronica').length },
    { id: 'mecanica', name: 'Ing. Mecánica', count: professors.filter(p => p.program === 'mecanica').length },
    { id: 'biologia', name: 'Biología', count: professors.filter(p => p.program === 'biologia').length },
    { id: 'datos', name: 'Ciencias de Datos', count: professors.filter(p => p.program === 'datos').length }
  ]

  const filteredProfessors = selectedProgram === 'all' 
    ? professors 
    : professors.filter(prof => prof.program === selectedProgram)

  const toggleFacultyExpansion = (professorId) => {
    setExpandedFaculty(expandedFaculty === professorId ? null : professorId)
  }

  return (
    <div className="guides-professors-page">
      {/* Header */}
      <motion.header 
        className="guides-header"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <button className="back-button" onClick={() => navigate('/mapa')}>
          <ArrowLeft size={20} />
          Volver al Mapa
        </button>
        <div className="header-content">
          <h1>Guías y Profesores</h1>
          <p>Conoce a nuestros expertos en IA y tecnología</p>
        </div>
      </motion.header>

      <div className="guides-content">
        {/* Program Filter */}
        <motion.div 
          className="program-filter"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3>Filtrar por Programa</h3>
          <div className="filter-buttons">
            {programs.map((program) => (
              <button
                key={program.id}
                className={`filter-btn ${selectedProgram === program.id ? 'active' : ''}`}
                onClick={() => setSelectedProgram(program.id)}
              >
                {program.name}
                <span className="count">({program.count})</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div 
          className="stats-overview"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="stat-card">
            <Users className="stat-icon" />
            <div className="stat-info">
              <div className="stat-number">{filteredProfessors.length}</div>
              <div className="stat-label">Profesores</div>
            </div>
          </div>
          <div className="stat-card">
            <Award className="stat-icon" />
            <div className="stat-info">
              <div className="stat-number">{filteredProfessors.reduce((sum, prof) => sum + prof.publications, 0)}</div>
              <div className="stat-label">Publicaciones</div>
            </div>
          </div>
          <div className="stat-card">
            <GraduationCap className="stat-icon" />
            <div className="stat-info">
              <div className="stat-number">{filteredProfessors.filter(prof => prof.available).length}</div>
              <div className="stat-label">Disponibles</div>
            </div>
          </div>
          <div className="stat-card">
            <BookOpen className="stat-icon" />
            <div className="stat-info">
              <div className="stat-number">{filteredProfessors.reduce((sum, prof) => sum + prof.courses.length, 0)}</div>
              <div className="stat-label">Cursos</div>
            </div>
          </div>
        </motion.div>

        {/* Professors Grid */}
        <motion.div 
          className="professors-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {filteredProfessors.map((professor, index) => (
            <motion.div
              key={professor.id}
              className={`professor-card ${expandedFaculty === professor.id ? 'expanded' : ''}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {/* Basic Info */}
              <div className="professor-header">
                <div className="professor-avatar">
                  <span className="avatar-emoji">{professor.avatar}</span>
                  <div className={`availability-indicator ${professor.available ? 'available' : 'busy'}`}></div>
                </div>
                <div className="professor-basic-info">
                  <h3>{professor.name}</h3>
                  <p className="professor-title">{professor.title}</p>
                  <p className="professor-specialization">{professor.specialization}</p>
                  <div className="professor-stats">
                    <span className="stat">{professor.publications} publicaciones</span>
                    <span className="stat">{professor.experience}</span>
                  </div>
                </div>
                <button
                  className="expand-button"
                  onClick={() => toggleFacultyExpansion(professor.id)}
                >
                  {expandedFaculty === professor.id ? <ChevronUp /> : <ChevronDown />}
                </button>
              </div>

              {/* Quick Contact */}
              <div className="quick-contact">
                <div className="contact-item">
                  <Mail size={16} />
                  <span>{professor.email}</span>
                </div>
                <div className="contact-item">
                  <Clock size={16} />
                  <span>{professor.officeHours}</span>
                </div>
                <div className={`availability-status ${professor.available ? 'available' : 'busy'}`}>
                  {professor.available ? 'Disponible para consultas' : 'No disponible'}
                </div>
              </div>

              {/* Expanded Details */}
              {expandedFaculty === professor.id && (
                <motion.div
                  className="professor-details"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Contact Information */}
                  <div className="details-section">
                    <h4>Información de Contacto</h4>
                    <div className="contact-grid">
                      <div className="contact-detail">
                        <Phone size={18} />
                        <span>{professor.phone}</span>
                      </div>
                      <div className="contact-detail">
                        <MapPin size={18} />
                        <span>{professor.office}</span>
                      </div>
                      <div className="contact-detail">
                        <Calendar size={18} />
                        <span>Horario de atención: {professor.officeHours}</span>
                      </div>
                    </div>
                  </div>

                  {/* Education */}
                  <div className="details-section">
                    <h4>Formación Académica</h4>
                    <ul className="education-list">
                      {professor.education.map((degree, idx) => (
                        <li key={idx}>{degree}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Research */}
                  <div className="details-section">
                    <h4>Área de Investigación</h4>
                    <p className="research-description">{professor.research}</p>
                  </div>

                  {/* Courses */}
                  <div className="details-section">
                    <h4>Cursos que Dicta</h4>
                    <div className="courses-tags">
                      {professor.courses.map((course, idx) => (
                        <span key={idx} className="course-tag">{course}</span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="professor-actions">
                    <button className="action-btn primary">
                      <Mail size={18} />
                      Enviar Email
                    </button>
                    <button className="action-btn secondary">
                      <Video size={18} />
                      Agendar Reunión
                    </button>
                    <button className="action-btn secondary">
                      <FileText size={18} />
                      Ver Publicaciones
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Resources Section */}
        <motion.div 
          className="resources-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3>Recursos Adicionales</h3>
          <div className="resources-grid">
            <div className="resource-card">
              <BookOpen className="resource-icon" />
              <h4>Biblioteca Digital</h4>
              <p>Acceso a papers y recursos académicos</p>
              <button className="resource-link">
                Explorar <ExternalLink size={16} />
              </button>
            </div>
            <div className="resource-card">
              <Video className="resource-icon" />
              <h4>Seminarios Online</h4>
              <p>Conferencias y talleres virtuales</p>
              <button className="resource-link">
                Ver Calendario <ExternalLink size={16} />
              </button>
            </div>
            <div className="resource-card">
              <Users className="resource-icon" />
              <h4>Grupos de Estudio</h4>
              <p>Únete a comunidades de aprendizaje</p>
              <button className="resource-link">
                Participar <ExternalLink size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default GuidesProfessors
