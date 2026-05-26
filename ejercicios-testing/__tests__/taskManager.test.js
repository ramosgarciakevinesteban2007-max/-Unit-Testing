const TaskManager = require('../src/taskManager');

describe('TaskManager', () => {

  let manager;

  beforeEach(() => {

    manager = new TaskManager();

  });

  it('una tarea nueva inicia como completed false', () => {

    const task = manager.addTask('Aprender Jest');

    expect(task.completed).toBe(false);

  });

  it('addTask aumenta el total de tareas', () => {

    manager.addTask('Tarea 1');

    expect(manager.getAll().length).toBe(1);

    manager.addTask('Tarea 2');

    expect(manager.getAll().length).toBe(2);

  });

  it('completeTask cambia el estado correctamente', () => {

    const t1 = manager.addTask('Node');
    const t2 = manager.addTask('React');

    manager.completeTask(t1.id);

    expect(manager.getAll()[0].completed).toBe(true);
    expect(manager.getAll()[1].completed).toBe(false);

  });

  it('removeTask elimina una tarea', () => {

    const task = manager.addTask('Eliminar esto');

    expect(manager.getAll().length).toBe(1);

    manager.removeTask(task.id);

    expect(manager.getAll().length).toBe(0);

  });

  it('getPending devuelve solo tareas pendientes', () => {

    const t1 = manager.addTask('Pendiente');
    const t2 = manager.addTask('Completa');

    manager.completeTask(t2.id);

    const pending = manager.getPending();

    expect(pending.length).toBe(1);
    expect(pending[0].title).toBe('Pendiente');

  });

  it('getCompleted devuelve solo tareas completadas', () => {

    const t1 = manager.addTask('Hacer pruebas');
    const t2 = manager.addTask('Estudiar');

    manager.completeTask(t1.id);

    const completed = manager.getCompleted();

    expect(completed.length).toBe(1);
    expect(completed[0].title).toBe('Hacer pruebas');

  });

  it('completeTask lanza error si el id no existe', () => {

    expect(() => manager.completeTask(999))
      .toThrow(Error);

  });

  it('removeTask lanza error si el id no existe', () => {

    expect(() => manager.removeTask(500))
      .toThrow('Tarea no encontrada');

  });

  it('addTask lanza error con título vacío', () => {

    expect(() => manager.addTask(''))
      .toThrow(Error);

    expect(() => manager.addTask('   '))
      .toThrow(Error);

  });

});