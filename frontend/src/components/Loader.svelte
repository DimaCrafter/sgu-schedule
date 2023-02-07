<div class="loader">
	<i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i>
</div>

<style>
.loader {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 33px;
    width: 96px;
    height: 96px;
    margin: 40px auto;
}

.loader > i {
    width: 10px;
    height: 10px;
    background-color: #e6e6e6;
    border-radius: 50%;
    animation: loader-part 1.5s infinite;
}

.loader > i:nth-child(2) { animation-delay: 150ms; }
.loader > i:nth-child(3) { animation-delay: 300ms; }
.loader > i:nth-child(4) { animation-delay: 450ms; }
.loader > i:nth-child(5) { animation-delay: 600ms; }
.loader > i:nth-child(6) { animation-delay: 750ms; }
.loader > i:nth-child(7) { animation-delay: 900ms; }
.loader > i:nth-child(8) { animation-delay: 1050ms; }
.loader > i:nth-child(9) { animation-delay: 1200ms; }

@keyframes loader-part {
    0% { transform: scale(0) translateY(22px); }
    50%, 75% { transform: scale(1) translateY(0); opacity: 1; }
    100% { transform: scale(0) translateY(-22px); opacity: 0; }
}
</style>