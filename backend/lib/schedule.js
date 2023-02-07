const { onError } = require('dc-api-core/errors');
onError(console.log);

const { getText } = require('../utils/http');
const xml = require('../utils/xml');

const TAG_REGEXP = /[А-Яа-я0-9]+\./g;
const TEACHER_REGEXP = /^[А-Я][а-я]+ [А-Я]\. ?[А-Я]?\.?$/;

function parse (raw) {
	const doc = xml(raw);
	const book = doc.body.Workbook;
	const rows = book.Worksheet[0].Table.Row;

	function parseTags (variant, tags) {
		let match;
		while (match = TAG_REGEXP.exec(tags)) {
			switch (match[0]) {
				case 'пр.':
					variant.type = 'practice';
					break;
				case 'лек.':
					variant.type = 'lecture';
					break;
				case 'лаб.':
					variant.type = 'lab';
					break;
				case 'чис.':
					variant.parity = 0;
					break;
				case 'знам.':
					variant.parity = 1;
					break;
			}
		}
	}

	let days = [[], [], [], [], [], [], []];
	let groups = new Set();
	for (let rowIndex = 2; rowIndex < rows.length; rowIndex++) {
		const cols = rows[rowIndex].Cell;
		const time = cols.shift().Data._text.split(/-\s*/);

		for (let colIndex = 0; colIndex < cols.length; colIndex++) {
			const value = cols[colIndex].Data._text;
			if (!value) continue;

			const lesson = { start: time[0], end: time[1], variants: [] };
			let variant = {};
			let i = 0;
			for (let line of value.split('\n')) {
				line = line.trim();
				if (!line.length) {
					if (i != 0) {
						i = 0;
						lesson.variants.push(variant);
						variant = {};
					}

					continue;
				}

				switch (i++) {
					case 0:
						const [tags, name] = line.split('\u00a0', 2);
						variant.name = name;
						parseTags(variant, tags);
						break;
					case 1:
						if (TEACHER_REGEXP.test(line)) {
							i++;
						} else {
							variant.group = line;
							groups.add(line);
							break;
						}
					case 2:
						if (TEACHER_REGEXP.test(line)) {
							variant.teacher = line;
							break;
						} else {
							i++;
						}
					case 3:
						variant.place = line;
						break;
				}
			}

			days[colIndex].push(lesson);
		}
	}

	return { days, groups: Array.from(groups) };
}

exports.getSchedule = async (faculty, group) => {
	const raw = await getText(`https://sgu.ru/schedule/${faculty}/do/${group}/lesson`);
	return parse(raw);
}
