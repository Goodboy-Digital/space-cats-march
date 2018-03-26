<?xml version="1.0" encoding="UTF-8"?>
<tileset name="GameItens" tilewidth="64" tileheight="64" tilecount="13" columns="0">
 <grid orientation="orthogonal" width="1" height="1"/>
 <tile id="0">
  <properties>
   <property name="type" value="Block"/>
  </properties>
  <image width="64" height="64" source="block.jpg"/>
 </tile>
 <tile id="1">
  <properties>
   <property name="life" type="int" value="0"/>
   <property name="type" value="Piece"/>
  </properties>
  <image width="64" height="64" source="p1.png"/>
 </tile>
 <tile id="2">
  <properties>
   <property name="life" type="int" value="1"/>
   <property name="type" value="Piece"/>
  </properties>
  <image width="64" height="64" source="p2.png"/>
 </tile>
 <tile id="3">
  <properties>
   <property name="life" type="int" value="2"/>
   <property name="type" value="Piece"/>
  </properties>
  <image width="64" height="64" source="p3.png"/>
 </tile>
 <tile id="4">
  <properties>
   <property name="life" type="int" value="3"/>
   <property name="type" value="Piece"/>
  </properties>
  <image width="64" height="64" source="p4.png"/>
 </tile>
 <tile id="5">
  <properties>
   <property name="life" type="int" value="4"/>
   <property name="type" value="Piece"/>
  </properties>
  <image width="64" height="64" source="p5.png"/>
 </tile>
 <tile id="6">
  <properties>
   <property name="life" type="int" value="5"/>
   <property name="type" value="Piece"/>
  </properties>
  <image width="64" height="64" source="p6.png"/>
 </tile>
 <tile id="7">
  <properties>
   <property name="life" type="int" value="6"/>
   <property name="type" value="Piece"/>
  </properties>
  <image width="64" height="64" source="p7.png"/>
 </tile>
 <tile id="9">
  <properties>
   <property name="life" type="int" value="0"/>
   <property name="type" value="Enemy"/>
  </properties>
  <image width="64" height="64" source="penemy.png"/>
 </tile>
 <tile id="10">
  <properties>
   <property name="life" type="int" value="5"/>
   <property name="type" value="LevelTarget"/>
  </properties>
  <image width="64" height="64" source="ptarget.png"/>
 </tile>
 <tile id="11">
  <properties>
   <property name="arrows" value="0,1,0"/>
   <property name="life" type="int" value="0"/>
   <property name="type" value="Bomb"/>
  </properties>
  <image width="64" height="64" source="pbomb.png"/>
 </tile>
 <tile id="12">
  <properties>
   <property name="arrows" value="1,0,0"/>
   <property name="life" type="int" value="0"/>
   <property name="type" value="Bomb"/>
  </properties>
  <image width="64" height="64" source="pbomb2.png"/>
 </tile>
 <tile id="13">
  <properties>
   <property name="arrows" value="0,0,1"/>
   <property name="life" type="int" value="0"/>
   <property name="type" value="Bomb"/>
  </properties>
  <image width="64" height="64" source="pbomb3.png"/>
 </tile>
</tileset>
