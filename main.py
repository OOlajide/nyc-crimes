import pydeck as pdk
import streamlit as st
import pandas as pd

st.set_page_config(layout="wide")
st.title("Visualising New York City crime data from 2006 - 2016.")
st.write("This is a visualisation of crimes reported to the New York City Police Department between 2006 to 2016.")
st.write("Locations with longer columns imply higher crime reports.")
st.write("Data: [NYC crime dataset](https://data.world/data-society/nyc-crime-data) from [data society](https://data.world/data-society).")

@st.experimental_memo()
def load_data():
    df = pd.read_csv("https://raw.githubusercontent.com/OOlajide/nyc_crime_dataset/main/nyc_crimes.csv")
    return df

df = load_data()
    
with st.spinner(text="Loading map... please wait for a few seconds"):
    st.pydeck_chart(pdk.Deck(
         map_style='mapbox://styles/mapbox/light-v9',
         initial_view_state=pdk.ViewState(
             latitude=40.95,
             longitude=-74.0,
             zoom=8.28,
             pitch=50,
             bearing=0
         ),
         layers=[
             pdk.Layer(
                'HexagonLayer',
                data=load_data(),
                get_position='[lng, lat]',
                radius=200,
                elevation_scale=18,
                elevation_range=[0, 3000],
                pickable=True,
                extruded=True,
             ),
         ],
     ))
