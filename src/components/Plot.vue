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

    <div class="row row1">
      <div class="col-12 d-flex justify-content-center mt-4">
        <div class="d-flex flex-column">
          <img
            src="https://i.pinimg.com/originals/2f/48/54/2f4854e80863db8219a256c7a35bd034.png"
            alt="logo"
            @click="reset"
          />
          <form>
            <div class="form-group">
              <input
                class="form-control"
                placeholder="Search for Starwars character or planet..."
                v-model="letter"
                @keyup="search(letter)"
              />
            </div>
            <div v-if="progress" class="spinner-border" role="status"></div>
            <ul class="list-group">
              <li
                v-for="(name, index) in arrayNames"
                :key="index"
                @click="add(index)"
                class="list-group-item"
              >{{ name }}</li>
            </ul>
          </form>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="icons">
        <i class="fas fa-walking human"></i>
        <i class="fas fa-globe planet"></i>
      </div>
      <div class="plots col-12">
        <div class="plot" v-for="(person, index) in fieldArray" :key="index">
          <p v-if="checkIfPlanet(index)" class="blue">
            {{ person.name }}
            <i id="close_icon" class="fas fa-times-circle" @click="close(index)"></i>
          </p>
          <p v-else class="red">
            {{ person.name }}
            <i id="close_icon" class="fas fa-times-circle" @click="close(index)"></i>
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
      </div>
      <h3 v-if="error !== ''" class="error">{{ error }}</h3>
      <h6 class="created">
        Created by
        <span>Marj Hajyahya</span> 2019
      </h6>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";

export default {
  data() {
    return {
      arrayObjects: [],
      arrayNames: [],
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
          this.arrayObjects = [];
          this.arrayNames = [];
          this.progress = true;
          const peopleURL = await axios.get(
            `https://swapi.co/api/people/?search=${letters}`
          );
          const people = peopleURL.data.results;

          for (let i = 0; i < people.length; i++) {
            const elementObj = people[i];
            this.arrayObjects.push(elementObj);
            for (let i = 0; i < this.arrayObjects.length; i++) {
              const elementName = this.arrayObjects[i].name;
              if (!this.arrayNames.includes(elementName)) {
                this.arrayNames.push(elementName);
              }
            }
          }
          const planetsURL = await axios.get(
            `https://swapi.co/api/planets/?search=${letters}`
          );
          const planets = planetsURL.data.results;

          for (const key in planets) {
            const elementObj = planets[key];
            this.arrayObjects.push(elementObj);
            for (let i = 0; i < this.arrayObjects.length; i++) {
              const elementName = this.arrayObjects[i].name;
              if (!this.arrayNames.includes(elementName)) {
                this.arrayNames.push(elementName);
              }
            }
          }
          this.progress = false;
        } else {
          this.arrayObjects = [];
          this.arrayNames = [];
        }
      } catch (e) {
        this.error = e;
      }
    },
    add(i) {
      if (this.fieldArray.length < 4) {
        const element = this.arrayObjects[i];
        this.fieldArray.push(element);
        this.arrayObjects = [];
        this.arrayNames = [];
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
      (this.arrayObjects = []),
        (this.arrayNames = []),
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
        self.arrayObjects = [];
        self.progress = false;
        self.error = "";
        self.networkError = "";
        self.arrayNames = [];
      }
    });
  }
  // watch: {
  //   arrayObjects(){
  //     for (let i = 0; i < this.arrayObjects.length; i++) {
  //       const element = this.arrayObjects[i];
  //       const name = element.name;
  //       if (condition) {

  //       }
  //     }
  //   }
  // }
};
</script>

<style>
.row1 {
  height: 170px;
}
.icons {
  margin: 40px auto 0;
}
.human {
  color: red;
  font-size: 20px;
  margin-right: 15px;
}
.planet {
  color: rgb(0, 140, 255);
  font-size: 20px;
}
.error {
  color: black;
  background-color: red;
  position: absolute;
  border-radius: 3px;
  bottom: 40px;
  left: 31%;
  height: 30px;
  width: 500px;
  text-align: center;
  font-size: 18px;
  padding: 3px;
}
.created {
  position: absolute;
  bottom: 9px;
  left: 41%;
  color: rgb(100, 100, 100);
}
.created > span {
  color: rgb(184, 0, 0);
}
.p_modal {
  color: black;
}
.plot_modal {
  padding: 1px;
  border-bottom: black solid 1px;
}
.blue {
  font-size: 20px;
  margin: 15px 5px 15px 15px;
  color: rgb(0, 140, 255);
}
.red {
  font-size: 20px;
  margin: 15px 5px 15px 15px;
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
  margin: 20px auto 30px;
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
#info_icon:hover {
  color: rgb(92, 92, 92);
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
  margin: 35px 0 0 90px;
}
.plot {
  position: relative;
  display: inline-block;
  width: 220px;
  height: 210px;
  background-color: rgb(0, 0, 0);
  border-radius: 4px;
  margin: 0 30px 0 20px;
}
.list-group-item {
  padding: 9px;
  width: 450px;
  z-index: 2;
}
.list-group {
  position: absolute;
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
  position: relative;
  width: 450px;
}
</style>
