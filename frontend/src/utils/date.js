export const DAYS_OF_WEEK = ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'];
export const MONTH_NAMES = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

export const DAY = 24 * 60 * 60 * 1000;
export const WEEK = 7 * DAY;

/** @param {string | number | Date} timestamp */
export function weekType (timestamp) {
	const current = new Date(timestamp);
	current.setHours(0, 0, 0, 0);
	const start = new Date(current);

	if (start.getMonth() - 8 < 0) {
		// Считаем от первого понедельника января для 2 семестра (текущий месяц идёт до сентября)
		start.setMonth(0);
		start.setDate(1);
		// (7 [дней в неделе] + 2 [отступ ВС-ПН] - день недели) % 8 [ограничение с двумя воскресеньями]
		start.setDate((9 - start.getDay()) % 8);
	} else {
		// Считаем от понедельника недели, имеющей 1 сентября
		start.setMonth(8);
		start.setDate(1);
		// текущий день - день недели + 1 [отступ ВС]
		start.setDate(2 - start.getDay());
	}

	// Чётность количества недель между начальной неделей и текущей является чётностью недели
	return Math.floor((current.getTime() - start.getTime()) / WEEK) % 2;
}

/**
 * @param {Date} today
 * @param {string} time
 * @returns {number}
 */
export function parseTimestamp (today, time) {
	console.log(today, time);
	let [hours, minutes] = time.split(':', 2);
	today.setHours(parseInt(hours));
	today.setMinutes(parseInt(minutes));
	return today.getTime();
}
