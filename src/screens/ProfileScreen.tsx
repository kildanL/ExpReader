import { View, Text, ImageBackground, Image, ScrollView, Pressable } from 'react-native'
import React, { useState } from 'react'
import { srcIcnPoints, srcIcnSetting, srcImgProfileHeader } from '../constants/images'
import { stylesProfileScreen } from './stylesScreen'
import { Avatar } from 'react-native-elements'
import { LinearProgress } from '@rneui/themed'
import { greenRarity, white } from '../constants/colors'
import { ProfileStackParams, TDailyTask, TPin, TUserData } from '../types'
import { pins } from '../TestData/pins'
import { BookProfileCard } from '../components/BookProfileCard'
import { NavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native'
import { getDailyTaskLevel } from '../service/motivation'
import { getDailyTaskAS, getTodayPagesAS, getUserDataAS } from '../service/asyncStorage'

export default function ProfileScreen() {

	const [userData, setUserData] = useState<TUserData | null>(null);
	const [todayPages, setTodayPages] = useState<number>(0);
	const [dailyTaskPages, setDailyTaskPages] = useState<TDailyTask>(60);
	const [dailyTaskLevel, setDailyTaskLevel] = useState<string>('');
	const { navigate } = useNavigation<NavigationProp<ProfileStackParams>>();

	useFocusEffect(
		React.useCallback(() => {
			getUserData();
			getTodayPages();
			getDailyTask();
			setDailyTaskLevel(getDailyTaskLevel(dailyTaskPages));
		}, [])
	);

	async function getUserData() {
		const data = await getUserDataAS();
		setUserData(data);
	}

	async function getTodayPages() {
		const todayPages = await getTodayPagesAS();
		setTodayPages(todayPages);
	}

	async function getDailyTask() {
		const dailyTask = await getDailyTaskAS();
		setDailyTaskPages(dailyTask);
	}

	//return first five pins
	const firstFivePins: JSX.Element[] = pins.slice(0, 5).map(item => {
		return <Image style={stylesProfileScreen.img_pin} source={item.img} />;
	});

	return (
		<>
			{!userData
				? <Text>Пользователь не найден</Text>
				:
				<ScrollView >
					<View style={stylesProfileScreen.profile_page}>

						{/* Header */}
						<ImageBackground style={stylesProfileScreen.img_header} source={srcImgProfileHeader}>
							<Avatar titleStyle={{ fontSize: 32, fontFamily: 'Montserrat700' }} size={'large'} containerStyle={stylesProfileScreen.avatar} rounded title='И' />
							<View style={stylesProfileScreen.container_avatar_points}>
								<Text style={stylesProfileScreen.text_name}>{userData.nickname}</Text>
								<View style={{ flexDirection: 'row', alignItems: 'center' }}>
									<Image style={stylesProfileScreen.icn_points} source={srcIcnPoints} />
									<Text style={stylesProfileScreen.text_points}>{userData.readPagesNum}</Text>
								</View>
							</View>
						</ImageBackground>

						{/* Daily task */}
						<Pressable onPress={() => navigate('DailyTask', { todayPages })}>
							<View style={stylesProfileScreen.container_level}>
								<View style={stylesProfileScreen.wrapper_text_level_settings}>
									{/* FIXME //! level is not updating */}
									<Text style={stylesProfileScreen.text_level_bold}>Уровень:
										<Text style={[stylesProfileScreen.text_level_medium, { color: greenRarity }]}> {dailyTaskLevel}</Text>
									</Text>
									<Image style={stylesProfileScreen.icn_settings} source={srcIcnSetting} />
								</View>
								<LinearProgress value={todayPages / dailyTaskPages} color={greenRarity} style={stylesProfileScreen.progress_bar} trackColor={white} variant='determinate' />
								<Text style={stylesProfileScreen.text_level_light}>Прочитано сегодня {todayPages} / {dailyTaskPages}</Text>
							</View>
						</Pressable>

						{/* Achievements */}
						<View style={stylesProfileScreen.container_achievements}>
							<Text style={stylesProfileScreen.h1_profile_bold}>Достижения:
								<Text style={stylesProfileScreen.h1_profile_medium}> 5</Text>
							</Text>
							<View style={stylesProfileScreen.wrapper_pins}>
								{firstFivePins}
							</View>
						</View>

						{/* Book shelf */}
						<View style={stylesProfileScreen.container_bookshelf}>
							<Text style={stylesProfileScreen.h1_profile_bold}>Полка:
								<Text style={stylesProfileScreen.h1_profile_medium}> 5</Text>
							</Text>
							<View style={stylesProfileScreen.container_profile_books}>
								<BookProfileCard />
								<BookProfileCard />
								<BookProfileCard />
								<BookProfileCard />
								<BookProfileCard />
							</View>
						</View>

					</View>
				</ScrollView>
			}
		</>
	)
}