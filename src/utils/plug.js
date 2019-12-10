
import Vue from 'vue'

import { Valid } from '@/utils/valid'

import { Filters } from '@/utils/filters'

import { Prompt } from '@/utils/prompt'

import { Recursion } from '@/utils/recursion'

import { Public } from '@/utils/public'

let plug = {
  valid:new Valid(),
  filters:new Filters(),
  recursion:new Recursion(),
  prompt:new Prompt(),
  public:new Public()
}

export default {
	install: function(Vue) {
		Vue.prototype.$plug = plug
	}
}

