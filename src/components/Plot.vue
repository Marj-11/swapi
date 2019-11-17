<template>
  <div class="container-fluid">
    <!-- ------------------------------------------------------------------------------------------ -->
    <div
      class="modal fade"
      id="exampleModalCenter"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalCenterTitle"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-body">
            <div class="plot_modal" v-for="el in modalArray[0]" :key="el.id">{{el}}</div>
            <div
              v-if="progModal"
              id="spinner-modal"
              class="spinner-border text-primary"
              role="status"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- ----------------------------------------------------------------------------------------------------------------------------- -->

    <div class="row">
      <div class="col-12 d-flex justify-content-center">
        <img
          src="https://i.pinimg.com/originals/2f/48/54/2f4854e80863db8219a256c7a35bd034.png"
          alt="logo"
          @click="reset"
        />
      </div>
    </div>
    <div class="row">
      <div class="col-3 d-flex justify-content-around">
        <form>
          <div class="form-group">
            <input class="form-control" placeholder="Name" v-model="letter" @keyup="search(letter)" />
          </div>
          <div v-if="progress" class="spinner-border" role="status"></div>
        </form>
        <div>
          <ul class="list-group">
            <li
              v-for="(name, index) in searchArray"
              :key="index"
              @click="add(index)"
              class="list-group-item"
            >{{ name.name }}</li>
          </ul>
        </div>
      </div>
      <div class="plots col-9 d-flex flex-wrap">
        <div class="plot" v-for="(person, index) in fieldArray" :key="index">
          <p v-if="checkIfPlanet(index)" class="blue">
            {{ person.name }}
            <i
              id="close_icon"
              class="fas fa-times-circle"
              @click="close(index)"
              data-toggle="tooltip"
              data-placement="top"
              title="Close"
            ></i>
          </p>
          <p v-else class="red">
            {{ person.name }}
            <i
              id="close_icon"
              class="fas fa-times-circle"
              @click="close(index)"
              data-toggle="tooltip"
              data-placement="top"
              title="Close"
            ></i>
          </p>

          <p v-if="checkIfPlanet(index)">
            Diameter:
            <span class="text-primary">{{ person.diameter }}</span>
          </p>
          <p v-else>
            Height:
            <span class="text-danger">{{ person.height }} cm</span>
          </p>
          <p v-if="checkIfPlanet(index)">
            Gravity:
            <span class="text-primary">{{ person.gravity}}</span>
          </p>
          <p v-else>
            Mass:
            <span class="text-danger">{{ person.mass }}</span>
          </p>

          <p v-if="checkIfPlanet(index)">
            Rotation Period:
            <span class="text-primary">{{ person.rotation_period }}</span>
          </p>
          <p v-else>
            Eye color:
            <span class="text-danger">{{ person.eye_color }}</span>
          </p>

          <p v-if="checkIfPlanet(index)">
            Orbital Period:
            <span class="text-primary">{{ person.orbital_period}}</span>
          </p>
          <p v-else>
            Hair color:
            <span class="text-danger">{{ person.hair_color }}</span>
          </p>

          <div class="icons mt-2">
            <i
              id="info_icon"
              class="fas fa-info-circle"
              data-toggle="modal"
              @click="addToModal(index)"
              data-target="#exampleModalCenter"
            ></i>
          </div>
        </div>
        <h2 v-if="error !== ''" class="error">{{ error }}</h2>
        <h2 v-if="networkError !== ''" class="error">{{networkError}}</h2>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";

export default {
  data() {
    return {
      searchArray: [],
      fieldArray: [],
      modalArray: [],
      letter: "",
      progress: false,
      progModal: false,
      error: "",
      networkError: ""
    };
  },
  methods: {
    async search(letters) {
      try {
        const trim = letters.trim();
        if (trim.length > 2) {
          this.searchArray = [];
          this.progress = true;
          const peopleURL = await axios.get(
            `https://swapi.co/api/people/?search=${letters}`
          );
          const people = peopleURL.data.results;

          for (const key in people) {
            const element = people[key];
            this.searchArray.push(element);
          }

          const planetsURL = await axios.get(
            `https://swapi.co/api/planets/?search=${letters}`
          );
          const planets = planetsURL.data.results;

          for (const key in planets) {
            const element = planets[key];
            this.searchArray.push(element);
          }

          this.progress = false;
        } else {
          this.searchArray = [];
        }
      } catch (e) {
        this.networkError = e;
      }
    },
    add(i) {
      if (this.fieldArray.length < 6) {
        const element = this.searchArray[i];
        this.fieldArray.push(element);
        this.searchArray = [];
        this.letter = "";
        this.error = "";
        this.progress = false;
      } else {
        this.error = "You cannot add more than 6 Cards";
        return;
      }
    },
    checkIfPlanet(i) {
      const obj = this.fieldArray[i];
      if (obj.hasOwnProperty("residents")) {
        return true;
      } else {
        return false;
      }
    },
    async checkIFLink(value) {
      if (typeof value === "object") {
        const arr = [];
        value.forEach(async element => {
          const link = await axios.get(element);
          const obj = link.data;
          const obj2 = Object.values(obj)[0];
          arr.push(obj2);
        });
        return arr;
      } else {
        const https = value.slice(0, 5);
        if (https === "https") {
          const link1 = await axios.get(value);
          const linkName1 = link1.data.name;
          return linkName1;
        } else {
          return value;
        }
      }
    },
    async addToModal(i) {
      this.modalArray = [];
      this.progModal = true;
      const obj = this.fieldArray[i];
      const output = [];
      for (let [key, value] of Object.entries(obj)) {
        const newValue = this.formatDate(key, value);
        const awaitValue = await this.checkIFLink(newValue);
        setTimeout(() => {
          output.push(`${key}: ${awaitValue}`);
        }, 4000);
      }
      this.modalArray.push(output);

      setTimeout(() => {
        this.modalArray[0].pop();
      }, 4000);
      setTimeout(() => {
        this.progModal = false;
      }, 2000);
    },

    close(index) {
      this.fieldArray.splice(index, 1);
      this.error = "";
    },
    formatDate(key, value) {
      if (key === "created" || key === "edited") {
        return moment(value).format("LLLL");
      } else {
        return value;
      }
    },
    reset() {
      (this.searchArray = []),
        (this.fieldArray = []),
        (this.modalArray = []),
        (this.letter = ""),
        (this.progress = false),
        (this.progModal = false),
        (this.error = ""),
        (this.networkError = "");
    }
  },
  created: function() {
    let self = this;
    window.addEventListener("click", function(e) {
      if (!self.$el.contains(e.target)) {
        self.searchArray = [];
        self.progress = false;
        self.error = "";
        self.networkError = "";
      }
    });
  }
};
</script>

<style>
.error {
  color: black;
  background-color: red;
  border-radius: 3px;
  margin-top: 7px;
  height: 30px;
  width: 400px;
  text-align: center;
  font-size: 18px;
  padding: 3px;
}
.p_modal {
  color: black;
}
.plot_modal {
  padding: 1px;
  border-bottom: black solid 1px;
}
.blue {
  margin-top: 15px;
  font-size: 25px;
  margin-bottom: 5px;
  color: rgb(0, 140, 255);
}
.red {
  margin-top: 15px;
  font-size: 25px;
  margin-bottom: 5px;
  color: red;
}
.modal-body {
  justify-content: center;

  height: 510px;
}
.modal-content {
  padding-right: 5px;
}

img {
  max-width: 200px;
  margin-top: 20px;
  margin-bottom: 20px;
}
img:hover {
  cursor: pointer;
}
p {
  margin: 3px 0 0 20px;
  color: white;
}
#info_icon {
  position: absolute;
  bottom: 9px;
  right: 10px;
  font-size: 20px;
  color: rgb(255, 255, 255);
  cursor: pointer;
}
#close_icon {
  position: absolute;
  right: 8px;
  top: 8px;
  font-size: 15px;
  color: rgb(77, 77, 77);
  cursor: pointer;
}
#close_icon:hover {
  color: red;
  cursor: pointer;
}
.control {
  position: relative;
  width: 200px;
}
.spinner-border {
  position: absolute;
  top: 8px;
  height: 22px;
  width: 22px;
  right: 10px;
  background-color: white;
}
#spinner-modal {
  position: absolute;
  top: 43%;
  left: 43%;
  height: 60px;
  width: 60px;
}
.plots {
  padding-left: 30px;
}
.plot {
  position: relative;
  width: 230px;
  height: 190px;
  background-color: rgb(0, 0, 0);
  margin: 0px 60px 10px 0;
  border-radius: 3px;
}
.list-group-item {
  padding: 6px;
  width: 250px;
  top: 38px;
}
.list-group-item:hover {
  background-color: orange;
  cursor: pointer;
}
.list-group-item:active {
  background-color: rgb(175, 123, 27);
  cursor: pointer;
}

form {
  position: absolute;
  width: 250px;
}
</style>
