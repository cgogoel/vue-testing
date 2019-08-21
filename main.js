Vue.config.devtools = true

Vue.component('product-review', {
  template: `
  <form class="review-form" @submit.prevent="onSubmit">

      <p v-if="errors.length">
        <b>Please correct the following error(s):</b>
        <ul>
          <li v-for="error in errors"> {{ error }} </li>
        </ul>
      <p>
        <label for="name">Name:</label>
        <input id="name" v-model="name" placeholder="name">
      </p>
      
      <p>
        <label for="review">Review:</label>      
        <textarea id="review" v-model="review"></textarea>
      </p>
      
      <p>
        <label for="rating">Rating:</label>
        <select id="rating" v-model.number="rating">
          <option>5</option>
          <option>4</option>
          <option>3</option>
          <option>2</option>
          <option>1</option>
        </select>
      </p>
          
      <p>
        <input type="submit" value="Submit">  
      </p>    
    
    </form>
  `,
  data() {
    return {
      name: null,
      review: null,
      rating: null,
      errors: []
    }
  },
  methods: {
    onSubmit() {
      if (this.name && this.review && this.rating) {
        let productReview = {
        name: this.name,
        review: this.review,
        rating: this.rating
      }
      this.$emit('review-submitted', productReview)
      this.name = null
      this.review = null
      this.rating = null
      }
      else {
        if (!this.name) this.errors.push("Name Required")
        if (!this.review) this.errors.push("Review Required")
        if (!this.rating) this.errors.push("Rating Required")
      }
    }
  }
})

Vue.component('productDetails', {
  props: {
    details: {
      type: Array,
      required: true
    }
  },
  template:
  `
  <ul>
    <li v-for="detail in details">{{ detail }}</li>
  </ul>
  `
})

Vue.component('product', {
  props: {
    premium: {
      type: Boolean,
      required: true
    }
  },
  template: 
  `
  <div class="product">
    <div class="product-image">
        <img :src="image" :height="height">

    <div class="product-info">
            <h1>{{ title }}</h1>
            <p v-if="inStock">In Stock</p>
            <p v-else :class="{ 'strike': !inStock }">Out of Stock</p>
            <p>Shipping: {{ shipping }}

            <productDetails :details="details"></productDetails>

            <div v-for="(variant, index) in variants" 
                :key="variant.variantId"
                class="color-box"
                :style="{ backgroundColor: variant.variantColor }"
                @mouseover="updateProduct(index)">
            </div>
    </div>

    <button @click="updateCart('add')" :disabled="!inStock">Add to Cart</button>
    <button @click="updateCart('remove')">Remove from Cart</button>

  </div>
  `,
  data() {
    return {
      product: 'Socks',
      brand: 'Vue Mastery',
      selectedVariant: 0,
      height: '200px',
      details: ["80% cotton", "20% polyester", "Gender-neutral"],
      variants: [
        {
          variantId: 2234,
          variantColor: "green",
          variantImage: './assets/test-green.png',
          variantQuantity: 10
        },
        {
          variantId: 2235,
          variantColor: "blue",
          variantImage: './assets/test-blue.png',
          variantQuantity: 2
        }
      ]
    }
  },
  methods: {
    updateCart(action) {
      this.$emit('update-cart', this.variants[this.selectedVariant].variantId, action)
    },
    removeFromCart() {
      if (this.cart > 0) {
        this.cart -= 1
      }
    },
    updateProduct(index) {
      this.selectedVariant = index
    }
  },
  computed: {
    title() {
      return this.brand + ' ' + this.product
    },
    image() {
      return this.variants[this.selectedVariant].variantImage
    },
    inStock() {
      return this.variants[this.selectedVariant].variantQuantity
    },
    shipping() {
      if (this.premium) {
        return "Free"
      }
      return "$2.99"
    }
  }
})

var app = new Vue({
    el: '#app',
    data: {
      premium: true,
      cart: [],
      reviews: []
    },
    methods: {
      updateCart(id, action) {
        if (action === 'add') {
          this.cart.push(id)
        }
        if (action === 'remove') {
          for(var i = this.cart.length -1; i >= 0; i--) {
            if (this.cart[i] === id) {
              this.cart.splice(i, 1);
              break
            }
          }
        }
      },
      addReview(productReview){
        this.reviews.push(productReview)
      }
    }
  })