const { HttpController } = require('dc-api-core');
const { getSchedule } = require('../lib/schedule');
const { getText } = require('../utils/http');
const { matchAll } = require('../utils/text');

const FACULTY_REGEXP = /<a href=(['"])\/schedule\/(\w+)\1>([А-Яа-я. ]+)<\/a>/;
const GROUP_REGEXP = /<a href=(['"])\/schedule\/\w+\/do\/([A-Za-z0-9.%]+)\1>([0-9А-Яа-я. ]+)<\/a>/;

module.exports = class Info extends HttpController {
	async faculties () {
		// todo: cron
		const raw = await getText('https://sgu.ru/schedule');
		const result = [];
		matchAll(raw, FACULTY_REGEXP, (_0, _1, code, name) => {
			result.push({ code, name });
		});

		return result;
	}

	async groups () {
		if (!this.query.faculty) return this.send('BadRequest', 400);
		// todo: check faculty

		const raw = await getText('https://sgu.ru/schedule/' + this.query.faculty);
		const result = [];
		matchAll(raw, GROUP_REGEXP, (_0, _1, code, name) => {
			result.push({ code, name });
		});

		// todo: группировать по типу группы
		return result.sort((a, b) => a.name.localeCompare(b.name));
	}

	async subgroups () {
		if (!this.query.faculty || !this.query.group) return this.send('BadRequest', 400);
		// todo: check faculty & group

		// todo: cron
		const schedule = await getSchedule(this.query.faculty, this.query.group);
		return schedule.groups;
	}

	async schedule () {
		if (!this.query.faculty || !this.query.group) return this.send('BadRequest', 400);
		// todo: check faculty & group

		// todo: cron
		const schedule = await getSchedule(this.query.faculty, this.query.group);
		return schedule.days;
	}
}
