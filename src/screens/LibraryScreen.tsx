import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { TLibBook } from '../types';
import { clearStorage, getFileBooksFromStorage, saveFileBooksToStorage } from '../service/asyncStorage';
import { BookLibCard } from '../components/BookLibCard';
import { stylesLibraryScreen } from './stylesScreen';



export default function LibraryScreen() {
    //TODO fix TS navigation error
    const fileBooksDir = FileSystem.documentDirectory + 'fileBooks/'; // directory for books added from file
    const { navigate } = useNavigation();
    const [fileBooks, setFileBooks] = useState<TLibBook[]>([]);

    useEffect(() => {
        getAllFileBooks();
    }, [])

    async function readText(filePath: string) {
        return await FileSystem.StorageAccessFramework.readAsStringAsync(filePath)
    }

    //TODO optimize this method
    // Add books from file to app dir and to local storage
    async function AddFromFile() {
        const result = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: false, type: 'text/txt' });

        if (result.type === "success" && FileSystem.documentDirectory) {
            //* copy file to app's dir/fileBooks
            await FileSystem.StorageAccessFramework.copyAsync(
                {
                    from: result.uri,
                    to: fileBooksDir
                });

            // const text = await readText(fileBooksDir + result.name);
            // alert(Math.ceil(text.length / 600));
            const bookInit: TLibBook = {
                id: 0,
                title: result.name,
                author: '',
                cover: '',
                bookPages: 0,
                currentPage: 0,
                readPages: 0,
                readDate: new Date(),
                isRead: false
            };
            saveFileBooksToStorage(bookInit);
        }
    }

    async function getAllFileBooks() {
        const bookFileNames: string[] = await FileSystem.readDirectoryAsync(fileBooksDir);

        const books = await getFileBooksFromStorage(bookFileNames);
        setFileBooks(books);
    }

    return (
        <View style={stylesLibraryScreen.container}>
            <FlatList
                data={fileBooks}
                keyExtractor={(item) => item.title}
                renderItem={({ item }) => <BookLibCard book={item} />} />

            <Button
                title='Add book'
                onPress={AddFromFile}
            />
            <Button
                title='get books'
                onPress={getAllFileBooks}
            />
            <Button
                title='Clear'
                onPress={clearStorage}
            />
        </View>
    );
}