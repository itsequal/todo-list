import { faker } from '@faker-js/faker';

//cambiar seed para generar datos diferentes
faker.seed(7778888);


for (let i = 0; i < 10; i++) {
    const titulo = faker.lorem.sentence(1);
    const descripcion = faker.lorem.lines(1);
    const estado = faker.helpers.arrayElement(['pendiente', 'en progreso', 'completada']);
    const fecha_vencimiento = faker.date.future({ years: 1 }).toISOString().slice(0, 10);
    const prioridad = faker.number.int({ min: 1, max: 5 });

    const query = `INSERT INTO tareas (titulo,descripcion,estado,fecha_vencimiento,prioridad) VALUES ('${titulo}','${descripcion}','${estado}','${fecha_vencimiento}',${prioridad});`;
    console.log(query);
}

