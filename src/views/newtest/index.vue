<template>
  <div class="card-container" @mouseover="flip = true" @mouseleave="flip = false">
    <div class="card" :class="{ 'is-flipped': flip }">
      <div class="card-front">
        Card image
        <h5 class="card-title">{{ title }}</h5>
      </div>
      <div class="card-back">
        <div class="card-body">
          <p class="card-text">{{ text }}</p>
          <a href="#" class="btn">Learn More</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    text: String,
    image: String
  },
  data() {
    return {
      flip: false
    };
  }
}
</script>

<style scoped>
.card-container {
  perspective: 1000px;
  width: 300px;
  height: 400px;
}

.card {
  width: 100%;
  height: 100%;
  transition: transform 1s;
  transform-style: preserve-3d;
}

.card.is-flipped {
  transform: rotateY(180deg);
}

.card-front, .card-back {
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  position: absolute;
  top: 0;
  left: 0;
}

.card-front {
  z-index: 2;
  /* Optional: For better text visibility */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
  background: linear-gradient(to bottom, #ffffff, #f0f9ff);
}



.card-title {
  font-size: 20px;
  color: #333;
}

.card-back {
  transform: rotateY(180deg);
  background-color: #007bff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.card-text {
  padding: 20px;
  font-size: 16px;
  text-align: center;
}

.btn {
  border: none;
  padding: 10px 20px;
  background-color: #0056b3;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  transition: background 0.3s;
}

.btn:hover {
  background-color: #003875;
}
</style>
