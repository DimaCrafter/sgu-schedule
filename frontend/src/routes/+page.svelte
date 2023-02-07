<header class="calendar">
	<div class="month">{MONTH_NAMES[currentWeek.getMonth()]} {currentWeek.getFullYear()}</div>
	<div class="parity">{PARITIES[parity]}</div>
	<a href="/settings" class="action" title="Перейти к настройкам"><Icon name="cog" /></a>

	<div class="days">
		{#each getWeekDays() as { date, day, muted }, i}
			<div on:click={() => deltaDays(i - currentDay + 1)} class="day" class:active={currentDay == day} class:muted={muted}>
				<div class="week-day">{DAYS_OF_WEEK[day]}</div>
				<span>{date}</span>
			</div>
		{/each}
	</div>
</header>
<main>
	{#if $schedule}
		{#each todaySchedule as lesson}
			<div class="lesson">
				<div class="time">
					<Icon name="clock" />с {lesson.start} по {lesson.end}
				</div>
				<div class="type {lesson.type}">{LESSON_TYPES[lesson.type]}</div>
				<div class="name">{lesson.name}</div>
				<div class="info">
					<div><Icon name="building" />{lesson.place}</div>
					<div><Icon name="user" />{lesson.teacher}</div>
				</div>
			</div>
		{/each}

		{#if !todaySchedule.length}
			<div id="party-block">
				<img src="/img/party.webp" alt="Изображение разлетающихся конфетти" />
				Сегодня нет пар!
				<!-- <br />
				<br />
				Хорошая причина, чтобы погулять, заняться чем-то полезным или просто отдохнуть. -->
			</div>
		{/if}
	{/if}
	<!-- <div id="party-block">
		<img src="/img/party.webp" alt="Изображение разлетающихся конфетти" />
		Ура! Пары закончились!
	</div> -->
</main>

<script>
import Icon from '../components/Icon.svelte'
import { DAYS_OF_WEEK, MONTH_NAMES, weekType } from '../utils/date'
import { settings, schedule } from '../utils/storage'

const LESSON_TYPES = {
	practice: 'Практика',
	lecture: 'Лекция',
	lab: 'Лаб. работа'
};

let currentWeek = new Date();
let currentDay = currentWeek.getDay();
currentWeek.setDate(currentWeek.getDate() - currentWeek.getDay() + 1);

const PARITIES = ['Числитель', 'Знаменатель'];

let todaySchedule, parity;
$: {
	parity = weekType(currentWeek);

	todaySchedule = $schedule && $schedule[currentDay ? currentDay - 1 : 6]
		.map(lesson => ({
			start: lesson.start,
			end: lesson.end,
			...lesson.variants.find(variant => {
				if (variant.group && !$settings.subgroups.includes(variant.group)) return false;
				if (variant.parity !== undefined && variant.parity != parity) return false;
				return true;
			})
		}))
		.filter(lesson => lesson.name);
}

function getWeekDays () {
	const date = new Date(currentWeek);
	const result = [];
	for (let i = 0; i < 7; i++) {
		const day = date.getDay();
		result.push({
			day,
			date: date.getDate(),
			active: currentDay == day,
			muted: i > 4//todo: только если нет пар
		});

		date.setDate(date.getDate() + 1);
	}

	return result;
}

function deltaDays (delta) {
	// currentWeek.setDate(currentWeek.getDate() + delta);
	currentDay = (currentDay + delta) % 7;
}
</script>

<style>
#party-block {
    margin: 48px auto;
	max-width: 250px;
    font-size: 18px;
    text-align: center;
	line-height: 1.5;
}

#party-block > img {
    display: block;
    width: 60px;
    margin: 0 auto;
    margin-bottom: 12px;
}
</style>