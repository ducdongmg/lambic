import Vue from 'vue'
import Vuex from 'vuex'
import { firebaseMutations, firebaseAction } from 'vuexfire'
import firebase from 'firebase/app'
import FirebaseConfig from '../firebase-config.json'
import 'firebase/firestore'
import moment from 'moment'

const firebaseApp = firebase.initializeApp(FirebaseConfig)
const firestore = firebaseApp.firestore()
firestore.settings({})

const users = firestore.collection('users')
const events = firestore.collection('events')
const presentations = firestore.collection('presentations')
const comments = firestore.collection('comments')

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    user: null,
    events: [],
    presentations: [],
    comments: []
  },
  getters: {
    events (state, getters) {
      return state.events
        .map((ev) => {
          return {
            ...ev,
            id: ev.id,
            date: ev.date.toDate(),
            presentations: getters.presentations
              .filter((pr) => pr.eventId === ev.id)
          }
        })
        .sort((a, b) => {
          // 開催日時の降順にソート
          return moment(a.date).isAfter(b.date) ? -1 : 1
        })
    },
    presentations (state, getters) {
      return state.presentations
        .map((pr) => {
          return {
            ...pr,
            id: pr.id,
            comments: getters.comments
              .filter((cm) => cm.presentationId === pr.id)
          }
        })
    },
    comments (state) {
      return state.comments
        .map((cm) => {
          return {
            ...cm,
            id: cm.id,
            postedAt: cm.postedAt.toDate()
          }
        })
        .sort((a, b) => {
          // 投稿日時の昇順にソート
          return !moment(a.date).isSame(b.date)
            ? (moment(a.date).isAfter(b.date) ? 1 : -1)
            : 0
        })
    },
    user (state) {
      return state.user
    },
    event (state, getters) {
      return (id) => getters.events.find((e) => e.id === id)
    },
    presentation (state, getters) {
      return (id) => getters.presentations.find((e) => e.id === id)
    },
    comment (state, getters) {
      return (id) => getters.comments.find((e) => e.id === id)
    }
  },
  mutations: {
    setUser (state, payload) {
      state.user = payload
    },
    ...firebaseMutations
  },
  actions: {
    initStore: firebaseAction(({ bindFirebaseRef }) => {
      bindFirebaseRef('users', users)
      bindFirebaseRef('events', events)
      bindFirebaseRef('presentations', presentations)
      bindFirebaseRef('comments', comments)
    }),
    login ({ commit }, auth) {
      const userDoc = users.doc(auth.uid)
      userDoc
        .get()
        .then((authUserInfo) => {
          if (authUserInfo.exists) {
            commit('setUser', {
              id: authUserInfo.id,
              name: authUserInfo.data().name,
              photoURL: authUserInfo.data().photoURL
            })
          } else {
            userDoc
              .set({
                name: auth.displayName,
                photoURL: auth.photoURL
              })
            commit('setUser', {
              id: auth.uid,
              name: auth.displayName,
              photoURL: auth.photoURL
            })
          }
        }).catch((error) => {
          console.log('Error getting document:', error)
        })
    },
    logout ({ commit }) {
      commit('setUser', null)
    },
    appendComment ({ state }, { comment, presentationId }) {
      comments.add({
        comment,
        postedAt: firebase.firestore.Timestamp.fromDate(new Date()),
        presentationId,
        userRef: users.doc(state.user.id)
      })
    }
  }
})
